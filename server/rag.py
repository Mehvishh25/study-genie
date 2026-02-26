import os
from flask import Blueprint, request, jsonify
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

# ===============================
# Blueprint
# ===============================
rag_bp = Blueprint("rag", __name__, url_prefix="/rag")

# ===============================
# Config
# ===============================
HF_TOKEN = os.getenv("HF_TOKEN")  # use environment variable
HUGGINGFACE_REPOID = "HuggingFaceH4/zephyr-7b-beta"

UPLOAD_FOLDER = "uploads"
VECTORSTORE_PATH = "vectorstore/db_faiss"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("vectorstore", exist_ok=True)

# ===============================
# Globals
# ===============================
db = None
qa_chain = None

# ===============================
# Embeddings
# ===============================
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ===============================
# LLM (Free HF model)
# ===============================
hf_endpoint = HuggingFaceEndpoint(
    repo_id=HUGGINGFACE_REPOID,
    task="text-generation",
    temperature=0.3,
    max_new_tokens=400,
    huggingfacehub_api_token=HF_TOKEN,
)

llm = ChatHuggingFace(llm=hf_endpoint)

# ===============================
# Prompt
# ===============================
CUSTOM_PROMPT = """
Use ONLY the following context to answer the question.
If the answer is not in the context, say:
"I could not find this in the provided documents."

Context:
{context}

Question:
{question}

Answer:
"""

prompt = PromptTemplate(
    template=CUSTOM_PROMPT,
    input_variables=["context", "question"]
)

# ===============================
# Upload Multiple PDFs
# ===============================
@rag_bp.route("/upload", methods=["POST"])
def upload_pdf():
    global db, qa_chain

    if "files" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")

    if len(files) == 0:
        return jsonify({"error": "No files selected"}), 400

    all_chunks = []

    for file in files:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        loader = PyPDFLoader(filepath)
        documents = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )

        chunks = text_splitter.split_documents(documents)
        all_chunks.extend(chunks)

    # If vectorstore exists → load and append
    if os.path.exists(VECTORSTORE_PATH):
        db = FAISS.load_local(
            VECTORSTORE_PATH,
            embedding_model,
            allow_dangerous_deserialization=True
        )
        db.add_documents(all_chunks)
    else:
        db = FAISS.from_documents(all_chunks, embedding_model)

    db.save_local(VECTORSTORE_PATH)

    # Build QA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=db.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt},
    )

    return jsonify({"message": "PDF(s) uploaded successfully"})


# ===============================
# Ask Question
# ===============================
@rag_bp.route("/ask", methods=["POST"])
def ask_question():
    global qa_chain, db

    if qa_chain is None:
        # Try loading existing vectorstore
        if os.path.exists(VECTORSTORE_PATH):
            db = FAISS.load_local(
                VECTORSTORE_PATH,
                embedding_model,
                allow_dangerous_deserialization=True
            )

            qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=db.as_retriever(search_kwargs={"k": 3}),
                return_source_documents=True,
                chain_type_kwargs={"prompt": prompt},
            )
        else:
            return jsonify({"error": "No PDFs uploaded yet"}), 400

    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    response = qa_chain.invoke({"query": question})

    answer = response["result"]
    sources = []

    for doc in response["source_documents"]:
        sources.append({
            "file": doc.metadata.get("source"),
            "page": doc.metadata.get("page"),
            "snippet": doc.page_content[:200]
        })

    return jsonify({
        "answer": answer,
        "sources": sources
    })
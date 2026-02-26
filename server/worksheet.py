from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load ENV
load_dotenv()

# Gemini Model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3
)

worksheet_bp = Blueprint("worksheet", __name__)


# -----------------------------
# Worksheet Logic
# -----------------------------
def generate_worksheet(
    grade,
    subject,
    difficulty,
    num_questions,
    question_types,
    topic,
    text_input=""
):

    reference_section = ""
    if text_input:
        reference_section = f"\nReference Text:\n{text_input}\n"

    prompt = f"""
You are an expert educational assistant.
Create a practice worksheet for students.

Grade: {grade}
Subject: {subject}
Topic: {topic}
Difficulty: {difficulty}
Number of Questions: {num_questions}
Question Types: {", ".join(question_types)}

Instructions:
- Provide a mix of requested question types
- Do NOT include answers after each question
- Add final section called "Answer Key"
- Keep language suitable for grade level
- If reference text exists, base questions strictly on it

{reference_section}

Return worksheet in clean numbered format.
"""

    response = llm.invoke([
        SystemMessage(content="You generate high quality academic worksheets."),
        HumanMessage(content=prompt)
    ])

    return response.content


# -----------------------------
# API Endpoint
# -----------------------------
@worksheet_bp.route("/worksheet/generate", methods=["POST"])
def worksheet_api():

    data = request.json

    worksheet = generate_worksheet(
        data.get("grade"),
        data.get("subject"),
        data.get("difficulty"),
        data.get("num_questions"),
        data.get("question_types"),
        data.get("topic"),
        data.get("text_input", "")
    )

    return jsonify({"output": worksheet})

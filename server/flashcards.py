from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
import json
import re

# -----------------------------
# Load ENV
# -----------------------------
load_dotenv()

# -----------------------------
# Initialize Gemini via LangChain
# -----------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3
)

flashcards_bp = Blueprint("flashcards", __name__)


# -----------------------------
# Flashcard Generation Logic
# -----------------------------
def generate_flashcards(text):

    prompt = f"""
You are an expert educational assistant.

From the following lecture notes, create concise and informative flashcards.

Rules:
- Each flashcard must contain:
    - One clear standalone Question
    - One short precise Answer
- Avoid repetition
- Avoid long explanations
- No extra commentary

Return ONLY valid JSON in this format:
[
  {{"Question": "What is ...?", "Answer": "..."}}
]

Lecture Notes:
{text}
"""

    try:
        response = llm.invoke([
            SystemMessage(content="You generate structured educational flashcards."),
            HumanMessage(content=prompt)
        ])

        raw_output = response.content.strip()

        # 🔥 Remove markdown code blocks if present
        raw_output = re.sub(r"```json", "", raw_output)
        raw_output = re.sub(r"```", "", raw_output).strip()

        # 🔥 Extract JSON array safely
        match = re.search(r"\[.*\]", raw_output, re.DOTALL)

        if match:
            try:
                flashcards_json = json.loads(match.group())
                return flashcards_json
            except Exception:
                return {
                    "error": "JSON parsing failed",
                    "raw": raw_output
                }

        return {
            "error": "Model did not return valid JSON",
            "raw": raw_output
        }

    except Exception as e:
        return {
            "error": "LLM request failed",
            "details": str(e)
        }


# -----------------------------
# API Endpoint
# -----------------------------
@flashcards_bp.route("/flashcards/generate", methods=["POST"])
def flashcards_api():

    data = request.json
    text = data.get("text") if data else None

    if not text:
        return jsonify({"error": "No lecture text provided"}), 400

    result = generate_flashcards(text)

    return jsonify(result)

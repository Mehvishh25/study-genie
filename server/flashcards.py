from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json
import re

# -----------------------------
# LOAD ENV
# -----------------------------
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# -----------------------------
# GEMINI MODEL
# -----------------------------
model = genai.GenerativeModel("gemini-2.5-flash")

flashcards_bp = Blueprint("flashcards", __name__)

# -----------------------------
# FLASHCARD GENERATION
# -----------------------------
def generate_flashcards(text):

    prompt = f"""
You are an expert educational assistant.

Create concise flashcards from lecture notes.

Rules:
- Each flashcard must have:
  - Question
  - Short Answer
- No explanations
- No extra text

Return ONLY valid JSON:

[
  {{"Question": "What is ...?", "Answer": "..."}}
]

Lecture Notes:
{text}
"""

    try:
        response = model.generate_content(prompt)
        raw_output = response.text.strip()

        print("🔥 RAW OUTPUT:\n", raw_output)

        # Remove markdown formatting if present
        raw_output = re.sub(r"```json", "", raw_output)
        raw_output = re.sub(r"```", "", raw_output).strip()

        # Extract JSON safely
        match = re.search(r"\[.*\]", raw_output, re.DOTALL)

        if match:
            try:
                return json.loads(match.group())
            except Exception as e:
                return {
                    "error": "JSON parsing failed",
                    "details": str(e),
                    "raw": raw_output
                }

        return {
            "error": "Model did not return valid JSON",
            "raw": raw_output
        }

    except Exception as e:
        return {
            "error": "Gemini request failed",
            "details": str(e)
        }

# -----------------------------
# API ENDPOINT
# -----------------------------
@flashcards_bp.route("/flashcards/generate", methods=["POST"])
def flashcards_api():

    data = request.json
    text = data.get("text") if data else None

    if not text:
        return jsonify({"error": "No lecture text provided"}), 400

    result = generate_flashcards(text)

    return jsonify(result)
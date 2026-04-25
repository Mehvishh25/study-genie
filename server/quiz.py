from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json
import re

# -----------------------------
# ENV + Gemini setup
# -----------------------------
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

quiz_bp = Blueprint("quiz", __name__)

# -----------------------------
# QUIZ GENERATOR
# -----------------------------
def generate_mcq_quiz(grade, subject, topic, difficulty, num_questions, text_input=""):

    reference_section = ""
    if text_input:
        reference_section = f"\nReference Text:\n{text_input[:6000]}\n"

    prompt = f"""
You are an expert educational assistant.

Create {num_questions} MCQs.

Rules:
- 4 options (A, B, C, D)
- Only JSON output
- No explanations

Grade: {grade}
Subject: {subject}
Topic: {topic}
Difficulty: {difficulty}

{reference_section}

Return ONLY JSON:

[
  {{
    "question": "...",
    "options": {{
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    }},
    "answer": "A"
  }}
]
"""

    try:
        response = model.generate_content(prompt)

        if not response or not getattr(response, "text", None):
            return {"error": "Empty response from Gemini"}

        raw_output = response.text.strip()

        print("🔥 RAW OUTPUT:", raw_output)  # debug

        # remove markdown
        raw_output = re.sub(r"```json|```", "", raw_output).strip()

        # extract JSON array
        match = re.search(r"\[.*\]", raw_output, re.DOTALL)

        if match:
            return json.loads(match.group())

        return {
            "error": "Invalid JSON returned",
            "raw": raw_output
        }

    except Exception as e:
        print("🔥 GEMINI ERROR:", str(e))
        return {"error": str(e)}

# -----------------------------
# API ROUTE
# -----------------------------
@quiz_bp.route("/quiz/generate", methods=["POST"])
def quiz_api():

    data = request.json

    result = generate_mcq_quiz(
        grade=data.get("grade"),
        subject=data.get("subject"),
        topic=data.get("topic"),
        difficulty=data.get("difficulty"),
        num_questions=data.get("num_questions", 5),
        text_input=data.get("text_input", "")
    )

    return jsonify(result)
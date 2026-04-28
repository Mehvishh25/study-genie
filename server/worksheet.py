from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import time
import os
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

worksheet_bp = Blueprint("worksheet", __name__)

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

    try:
        response = model.generate_content(prompt)

        time.sleep(10)

        return response.text

    except Exception as e:
        print("ERROR:", str(e))
        return "Rate limit hit. Please wait 30–60 seconds and try again."



@worksheet_bp.route("/worksheet/generate", methods=["POST"])
def worksheet_api():
    try:
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

    except Exception as e:
        print("SERVER ERROR:", str(e))
        return jsonify({"output": "Server error"}), 500
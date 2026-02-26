from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

quiz_bp = Blueprint("quiz", __name__)


def generate_mcq_quiz(
    grade,
    subject,
    topic,
    difficulty,
    num_questions,
    text_input=""
):

    reference_section = ""
    if text_input:
        reference_section = f"\nUse the following reference text strictly:\n{text_input}\n"

    prompt = f"""
You are an expert educational assistant.

Create a quiz of {num_questions} multiple-choice questions (MCQs).

Grade: {grade}
Subject: {subject}
Topic: {topic}
Difficulty: {difficulty}

Instructions:
- Each question must have exactly 4 options labeled A, B, C, D.
- Clearly mention the correct answer after each question.
- Do not include explanations.
- Avoid repetition.

{reference_section}

Return ONLY raw JSON in this format:

[
  {{
    "question": "Question text?",
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

    response = llm.invoke([
        SystemMessage(content="You generate structured academic MCQ quizzes."),
        HumanMessage(content=prompt)
    ])

    raw_output = response.content.strip()

    # Remove markdown formatting if present
    if raw_output.startswith("```"):
        raw_output = raw_output.replace("```json", "")
        raw_output = raw_output.replace("```", "")
        raw_output = raw_output.strip()

    import json
    try:
        return json.loads(raw_output)
    except:
        return {"error": "Model did not return valid JSON", "raw": raw_output}


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

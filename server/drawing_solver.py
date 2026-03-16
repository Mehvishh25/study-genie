import io
import base64
import os
import uuid
import re

from flask import Blueprint, request, jsonify
from PIL import Image
from gtts import gTTS

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

drawing_solver_bp = Blueprint("drawing_solver", __name__)

# ------------------------------
# LLM INIT
# ------------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_retries=3,
    timeout=60
)

# ------------------------------
# PROMPT
# ------------------------------
PROMPT_TEMPLATE = """
You are an AI tutor that understands handwritten drawings.

Analyze the uploaded image carefully.

Tasks:
1. If the image contains a math problem → solve step by step.
2. If it contains a diagram → explain it clearly.
3. If it contains a graph → describe what it represents.
4. If it contains a handwritten question → answer it.

Return the answer in plain text only.
Do NOT use markdown symbols like *, **, #, bullet points, or formatting.
Explain clearly step by step.
"""

# ------------------------------
# ROUTE
# ------------------------------
@drawing_solver_bp.route("/solve-drawing", methods=["POST"])
def solve_drawing():

    if "image" not in request.files:
        return jsonify({"result": "No image uploaded"}), 400

    try:
        file = request.files["image"]
        user_text = request.form.get("text", "")

        # ------------------------------
        # Load Image
        # ------------------------------
        image = Image.open(io.BytesIO(file.read())).convert("RGB")

        # Resize large images
        if image.width > 800:
            ratio = 800 / image.width
            image = image.resize((800, int(image.height * ratio)))

        # ------------------------------
        # Convert Image → Base64
        # ------------------------------
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        img_base64 = base64.b64encode(buffer.getvalue()).decode()

        # ------------------------------
        # LLM MESSAGE
        # ------------------------------
        message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": PROMPT_TEMPLATE + f"\nUser Prompt: {user_text}"
                },
                {
                    "type": "image_url",
                    "image_url": f"data:image/png;base64,{img_base64}"
                }
            ]
        )

        # ------------------------------
        # CALL LLM
        # ------------------------------
        response = llm.invoke([message])
        answer = response.content

        # ------------------------------
        # CLEAN MARKDOWN SYMBOLS
        # ------------------------------
        clean_answer = re.sub(r"[*#_`>-]", "", answer)
        clean_answer = re.sub(r"\n+", "\n", clean_answer).strip()
        clean_answer = clean_answer.replace(":", ".")  # better pauses for speech

        # ------------------------------
        # GENERATE AUDIO
        # ------------------------------
        os.makedirs("static/audio", exist_ok=True)

        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join("static/audio", filename)

        tts = gTTS(text=clean_answer, lang="en")
        tts.save(filepath)

        audio_url = f"http://127.0.0.1:5000/static/audio/{filename}"

        # ------------------------------
        # RETURN RESPONSE
        # ------------------------------
        return jsonify({
            "result": clean_answer,
            "audio": audio_url
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"result": "Error solving drawing"}), 500

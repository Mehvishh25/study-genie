import io
import base64
import os
import uuid
import re

from flask import Blueprint, request, jsonify
from PIL import Image
from gtts import gTTS

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

drawing_solver_bp = Blueprint("drawing_solver", __name__)

PROMPT_TEMPLATE = """
You are an AI tutor that understands handwritten drawings.

Analyze the image:

1. If math problem → solve step-by-step
2. If diagram → explain clearly
3. If graph → interpret meaning
4. If question → answer it

Return plain text only.
No markdown, no symbols, no formatting.
"""

@drawing_solver_bp.route("/solve-drawing", methods=["POST"])
def solve_drawing():

    if "image" not in request.files:
        return jsonify({"result": "No image uploaded"}), 400

    try:
        file = request.files["image"]
        user_text = request.form.get("text", "")

        image = Image.open(io.BytesIO(file.read())).convert("RGB")

        if image.width > 800:
            ratio = 800 / image.width
            image = image.resize((800, int(image.height * ratio)))

        buffer = io.BytesIO()
        image.save(buffer, format="PNG")

        img_base64 = base64.b64encode(buffer.getvalue()).decode()

        full_prompt = PROMPT_TEMPLATE + f"\nUser Text: {user_text}"

        response = model.generate_content([
            {
                "role": "user",
                "parts": [
                    full_prompt,
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": img_base64
                        }
                    }
                ]
            }
        ])

        if not response or not getattr(response, "text", None):
            return jsonify({"result": "Empty response from model"}), 500

        answer = response.text

        clean_answer = re.sub(r"[*#_`>-]", "", answer)
        clean_answer = re.sub(r"\n+", "\n", clean_answer).strip()
        clean_answer = clean_answer.replace(":", ".")

        os.makedirs("static/audio", exist_ok=True)

        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join("static/audio", filename)

        tts = gTTS(text=clean_answer, lang="en")
        tts.save(filepath)

        audio_url = f"http://127.0.0.1:5000/static/audio/{filename}"

        return jsonify({
            "result": clean_answer,
            "audio": audio_url
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"result": "Error solving drawing"}), 500
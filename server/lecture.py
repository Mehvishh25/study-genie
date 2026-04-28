import os
import logging
from flask import Blueprint, request, jsonify
from groq import Groq
import google.generativeai as genai
from langdetect import detect
import re

lecture_bp = Blueprint("lecture_bp", __name__, url_prefix="/lecture")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

groq_client = Groq(api_key=GROQ_API_KEY)
genai.configure(api_key=GEMINI_API_KEY)

logging.basicConfig(level=logging.INFO)

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    try:
        if detect(text) != 'en':
            return ""
    except:
        pass
    return text.strip()

def summarize_text_gemini(text):
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    prompt = f"""
    You are an AI assistant. Summarize the following lecture transcript:
    1. Keep only educational content.
    2. Highlight key points.
    3. Provide structured notes.

    Transcript:
    {text}
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logging.error(f"Summarization error: {e}")
        return "[Summarization error]"

@lecture_bp.route("/summarize", methods=["POST"])
def summarize_lecture():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = f"temp_{file.filename}"
    file.save(file_path)

    try:
        with open(file_path, "rb") as audio_file:
            transcription = groq_client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                language="en"
            )
        transcript_text = getattr(transcription, "text", "")
    except Exception as e:
        os.remove(file_path)
        return jsonify({"error": f"Transcription failed: {e}"}), 500

    os.remove(file_path)

    cleaned_text = clean_text(transcript_text)

    summary = summarize_text_gemini(cleaned_text)

    return jsonify({
        "transcript": cleaned_text,
        "summary": summary
    })
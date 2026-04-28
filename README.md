StudyGenie – AI-Powered Smart Learning Assistant
Overview

StudyGenie is an AI-powered educational platform that automates and enhances learning processes. It integrates multiple intelligent modules such as document-based question answering, face recognition attendance, lecture transcription, doubt solving, and automated content generation.

The system uses technologies like Retrieval-Augmented Generation (RAG), Natural Language Processing (NLP), Computer Vision, and Speech Recognition to provide accurate and context-aware learning support.

Features
1. RAG (Document Question Answering)
Upload PDF documents
Splits and processes text into chunks
Generates embeddings and stores them in FAISS
Retrieves relevant context to answer queries
Prevents hallucinated responses using prompt control
2. Face Recognition Attendance
Captures face images using webcam
Detects faces using OpenCV
Trains KNN-based recognition model
Automatically marks attendance in CSV
Prevents duplicate or unknown entries
3. Lecture Transcription and Summarization
Upload lecture audio files
Converts speech to text using Whisper
Cleans transcript text
Generates structured summaries using AI
4. Doubt Solver (Image-Based)
Upload handwritten problems or diagrams
Supports math, graphs, and conceptual queries
Generates step-by-step solutions
Provides audio explanation using text-to-speech
5. Quiz Generator
Generates MCQs based on topic, grade, and difficulty
Provides 4 options and correct answers
Returns structured JSON output
6. Worksheet Generator
Generates practice worksheets
Supports multiple question types
Includes answer key
Customizable difficulty and topic
7. Flashcard Generator
Converts notes into flashcards
Generates concise question–answer pairs
Useful for quick revision


Tech Stack

Frontend

Next.js

Backend

Flask

AI / ML

LangChain
Hugging Face
Google Gemini API
Groq (Whisper)

Libraries and Tools

FAISS
OpenCV
scikit-learn
gTTS
NumPy, Pandas, PIL
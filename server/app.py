from flask import Flask
from flask_cors import CORS

from worksheet import worksheet_bp
from flashcards import flashcards_bp
from quiz import quiz_bp
from face_attendance import face_bp
from rag import rag_bp
from lecture import lecture_bp
from drawing_solver import drawing_solver_bp


app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(worksheet_bp)
app.register_blueprint(flashcards_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(face_bp)
app.register_blueprint(rag_bp)
app.register_blueprint(lecture_bp)
app.register_blueprint(drawing_solver_bp)

@app.route("/")
def home():
    return {"message": "Server Running"}

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

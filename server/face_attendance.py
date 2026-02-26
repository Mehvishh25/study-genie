import cv2
import os
import numpy as np
import pandas as pd
import joblib
from datetime import date, datetime
from flask import Blueprint, request, jsonify
from sklearn.neighbors import KNeighborsClassifier

face_bp = Blueprint("face", __name__, url_prefix="/face")

# ---------------- Configuration ---------------- #
nimgs = 20
datetoday = date.today().strftime("%m_%d_%y")

face_detector = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

os.makedirs("Attendance", exist_ok=True)
os.makedirs("static/faces", exist_ok=True)

attendance_file = f"Attendance/Attendance-{datetoday}.csv"

if not os.path.exists(attendance_file):
    with open(attendance_file, "w") as f:
        f.write("Name,Roll,Time\n")

# ---------------- Helper Functions ---------------- #

def extract_faces(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return face_detector.detectMultiScale(gray, 1.2, 5)


def train_model():
    faces, labels = [], []

    for user in os.listdir("static/faces"):
        user_path = os.path.join("static/faces", user)

        for imgname in os.listdir(user_path):
            img = cv2.imread(os.path.join(user_path, imgname))
            resized_face = cv2.resize(img, (50, 50))
            faces.append(resized_face.ravel())
            labels.append(user)

    if faces:
        knn = KNeighborsClassifier(n_neighbors=5)
        knn.fit(np.array(faces), labels)
        joblib.dump(knn, "static/face_recognition_model.pkl")


def identify_face(facearray):
    model = joblib.load("static/face_recognition_model.pkl")
    return model.predict(facearray)


def add_attendance(name):
    username, userid = name.split("_")
    current_time = datetime.now().strftime("%H:%M:%S")

    df = pd.read_csv(attendance_file)

    if int(userid) not in list(df["Roll"]):
        with open(attendance_file, "a") as f:
            f.write(f"\n{username},{userid},{current_time}")
        return True

    return False


# =========================
# REGISTER USER
# =========================

@face_bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    name = data.get("name")
    roll = data.get("roll")

    if not name or not roll:
        return jsonify({"error": "Name and Roll required"}), 400

    userfolder = f"static/faces/{name}_{roll}"
    os.makedirs(userfolder, exist_ok=True)

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return jsonify({"error": "Camera not detected"}), 500

    i = 0
    while i < nimgs:
        ret, frame = cap.read()
        if not ret:
            break

        faces = extract_faces(frame)

        for (x, y, w, h) in faces:
            face_img = frame[y:y+h, x:x+w]
            cv2.imwrite(f"{userfolder}/{name}_{i}.jpg", face_img)
            i += 1

        cv2.imshow("Registering User", frame)
        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

    train_model()
    add_attendance(f"{name}_{roll}")

    return jsonify({"message": "User registered & attendance marked"})


# =========================
# MARK ATTENDANCE
# =========================

@face_bp.route("/mark", methods=["POST"])
def mark_attendance():

    if not os.path.exists("static/face_recognition_model.pkl"):
        return jsonify({"error": "No registered users yet"}), 400

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return jsonify({"error": "Camera not detected"}), 500

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        faces = extract_faces(frame)

        for (x, y, w, h) in faces:
            face = cv2.resize(frame[y:y+h, x:x+w], (50, 50))
            identified_person = identify_face(face.reshape(1, -1))[0]

            add_attendance(identified_person)

            cap.release()
            cv2.destroyAllWindows()

            return jsonify({
                "message": "Attendance marked",
                "person": identified_person
            })

        cv2.imshow("Mark Attendance", frame)
        if cv2.waitKey(1) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

    return jsonify({"message": "Face not detected"})


# =========================
# 🆕 GET ALL DATES (Latest → Oldest)
# =========================

@face_bp.route("/dates", methods=["GET"])
def get_attendance_dates():
    files = os.listdir("Attendance")

    attendance_files = [
        f for f in files
        if f.startswith("Attendance-") and f.endswith(".csv")
    ]

    attendance_files.sort(reverse=True)

    dates = [
        f.replace("Attendance-", "").replace(".csv", "")
        for f in attendance_files
    ]

    return jsonify({"dates": dates})


# =========================
# 📄 GET ATTENDANCE BY DATE
# =========================

@face_bp.route("/attendance/<date>", methods=["GET"])
def get_attendance_by_date(date):
    file_path = f"Attendance/Attendance-{date}.csv"

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    df = pd.read_csv(file_path)

    return jsonify({
        "records": df.to_dict(orient="records")
    })
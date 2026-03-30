from __future__ import annotations

from flask import Flask, jsonify, request
from flask_cors import CORS

from frontend_functions import (
    add_admin_user,
    add_mark,
    add_student,
    add_subject,
    add_user,
    assign_student_to_class,
    create_class,
    delete_student,
    login_check,
    search_student,
    update_student,
    view_all_students,
    view_student_mark,
)

app = Flask(__name__)
CORS(app)


def _json() -> dict:
    payload = request.get_json(silent=True)
    return payload if isinstance(payload, dict) else {}


def _to_int(value, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _to_float(value, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


@app.get("/api/health")
def health_check():
    return jsonify({"success": True, "message": "API is running"})


@app.post("/api/admins")
def create_admin():
    data = _json()
    result = add_admin_user(
        full_name=data.get("full_name", ""),
        email=data.get("email", ""),
        username=data.get("username", ""),
        password=data.get("password", ""),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.post("/api/users")
def create_user_login():
    data = _json()
    result = add_user(
        student_id=_to_int(data.get("student_id", 0)),
        username=data.get("username", ""),
        password=data.get("password", ""),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.post("/api/login")
def login():
    data = _json()
    result = login_check(
        username=data.get("username", ""),
        password=data.get("password", ""),
    )
    return jsonify(result), 200 if result.get("success") else 401


@app.post("/api/students")
def create_student():
    data = _json()
    result = add_student(
        roll_number=data.get("roll_number", ""),
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name"),
        email=data.get("email"),
        phone=data.get("phone"),
        date_of_birth=data.get("date_of_birth"),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.get("/api/students")
def get_students():
    return jsonify({"success": True, "students": view_all_students()})


@app.get("/api/students/search")
def find_students():
    keyword = request.args.get("keyword", "")
    return jsonify({"success": True, "students": search_student(keyword)})


@app.put("/api/students/<int:student_id>")
def edit_student(student_id: int):
    data = _json()
    result = update_student(
        student_id=student_id,
        roll_number=data.get("roll_number", ""),
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name"),
        email=data.get("email"),
        phone=data.get("phone"),
        date_of_birth=data.get("date_of_birth"),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.delete("/api/students/<int:student_id>")
def remove_student(student_id: int):
    result = delete_student(student_id)
    return jsonify(result), 200 if result.get("success") else 404


@app.post("/api/subjects")
def create_subject():
    data = _json()
    result = add_subject(
        subject_code=data.get("subject_code", ""),
        subject_name=data.get("subject_name", ""),
        description=data.get("description"),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.post("/api/classes")
def create_classroom():
    data = _json()
    result = create_class(
        class_name=data.get("class_name", ""),
        section=data.get("section", ""),
        academic_year=data.get("academic_year", ""),
        class_teacher=data.get("class_teacher"),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.post("/api/classes/assign")
def assign_class():
    data = _json()
    result = assign_student_to_class(
        student_id=_to_int(data.get("student_id", 0)),
        class_id=_to_int(data.get("class_id", 0)),
        status=data.get("status", "active"),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.post("/api/marks")
def create_mark():
    data = _json()
    result = add_mark(
        student_id=_to_int(data.get("student_id", 0)),
        subject_id=_to_int(data.get("subject_id", 0)),
        class_id=_to_int(data.get("class_id", 0)),
        exam_name=data.get("exam_name", ""),
        max_marks=_to_float(data.get("max_marks", 0)),
        obtained_marks=_to_float(data.get("obtained_marks", 0)),
        exam_date=data.get("exam_date"),
    )
    return jsonify(result), 200 if result.get("success") else 400


@app.get("/api/students/<int:student_id>/marks")
def get_marks(student_id: int):
    return jsonify({"success": True, "marks": view_student_mark(student_id)})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

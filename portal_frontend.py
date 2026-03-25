from flask import Flask, redirect, render_template_string, request, url_for

from frontend_functions import (
    add_mark,
    add_admin_user,
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

LANDING_TEMPLATE = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Student Management Portal</title>
  <style>
    :root {
      --bg: #f6f4ef;
      --card: #ffffff;
      --ink: #1f2937;
      --accent: #0f766e;
      --accent-soft: #99f6e4;
      --muted: #6b7280;
      --warn: #b45309;
      --ok: #166534;
      --border: #d1d5db;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: radial-gradient(circle at top right, var(--accent-soft), transparent 35%), var(--bg);
      color: var(--ink);
    }
    .wrap {
      max-width: 980px;
      margin: 24px auto;
      padding: 0 16px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 2rem;
      color: var(--accent);
    }
    .sub {
      margin-bottom: 18px;
      color: var(--muted);
    }
    .status {
      padding: 10px 12px;
      border-radius: 10px;
      margin: 0 0 18px;
      font-size: 0.95rem;
      border: 1px solid var(--border);
      background: #fff;
    }
    .status.ok { border-color: #86efac; color: var(--ok); }
    .status.warn { border-color: #fcd34d; color: var(--warn); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.04);
    }
    h2 { margin-top: 0; }
    form {
      display: grid;
      gap: 8px;
    }
    input {
      width: 100%;
      padding: 9px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #fff;
    }
    button {
      border: 0;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 600;
      color: white;
      background: var(--accent);
      cursor: pointer;
    }
    .link-btn {
      text-decoration: none;
      display: inline-block;
      margin-top: 8px;
      padding: 10px 12px;
      border-radius: 10px;
      color: var(--accent);
      border: 1px solid var(--accent);
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Student Management Portal</h1>
    <p class="sub">Choose your signup type to continue.</p>

    {% if message %}
      <div class="status {{ 'ok' if success else 'warn' }}">{{ message }}</div>
    {% endif %}

    <div class="grid">
      <div class="card">
        <h2>Admin Signup</h2>
        <form method="post" action="{{ url_for('admin_signup_route') }}">
          <input name="full_name" placeholder="Full Name" required>
          <input name="email" type="email" placeholder="Email" required>
          <input name="username" placeholder="Admin Username" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Create Admin Account</button>
        </form>
        <a class="link-btn" href="{{ url_for('admin_dashboard') }}">Go To Admin Page</a>
      </div>

      <div class="card">
        <h2>Student Signup</h2>
        <form method="post" action="{{ url_for('student_signup_route') }}">
          <input name="roll_number" placeholder="Roll Number" required>
          <input name="first_name" placeholder="First Name" required>
          <input name="last_name" placeholder="Last Name">
          <input name="email" type="email" placeholder="Email">
          <input name="phone" placeholder="Phone">
          <input name="date_of_birth" placeholder="YYYY-MM-DD">
          <input name="username" placeholder="Student Username" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Create Student Account</button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
"""

PAGE_TEMPLATE = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Student Management Portal</title>
  <style>
    :root {
      --bg: #f6f4ef;
      --card: #ffffff;
      --ink: #1f2937;
      --accent: #0f766e;
      --accent-soft: #99f6e4;
      --muted: #6b7280;
      --warn: #b45309;
      --ok: #166534;
      --border: #d1d5db;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: radial-gradient(circle at top right, var(--accent-soft), transparent 35%), var(--bg);
      color: var(--ink);
    }
    .wrap {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
    }
    h1 {
      margin: 0 0 16px;
      font-size: 2rem;
      color: var(--accent);
    }
    .status {
      padding: 10px 12px;
      border-radius: 10px;
      margin: 0 0 18px;
      font-size: 0.95rem;
      border: 1px solid var(--border);
      background: #fff;
    }
    .status.ok { border-color: #86efac; color: var(--ok); }
    .status.warn { border-color: #fcd34d; color: var(--warn); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.04);
    }
    h2 {
      margin-top: 0;
      font-size: 1.05rem;
      color: #0f172a;
    }
    form {
      display: grid;
      gap: 8px;
    }
    input {
      width: 100%;
      padding: 9px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #fff;
    }
    button {
      border: 0;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 600;
      color: white;
      background: var(--accent);
      cursor: pointer;
    }
    button:hover { filter: brightness(0.95); }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    th, td {
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      padding: 8px;
      font-size: 0.9rem;
    }
    th { background: #ecfeff; color: #0f766e; }
    .muted { color: var(--muted); }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Student Management Portal</h1>

    {% if message %}
      <div class="status {{ 'ok' if success else 'warn' }}">{{ message }}</div>
    {% endif %}

    <div class="grid">
      <div class="card">
        <h2>1. Add User</h2>
        <form method="post" action="{{ url_for('add_user_route') }}">
          <input name="student_id" placeholder="Student ID" required>
          <input name="username" placeholder="Username" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Add User</button>
        </form>
      </div>

      <div class="card">
        <h2>2. Login Check</h2>
        <form method="post" action="{{ url_for('login_check_route') }}">
          <input name="username" placeholder="Username" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Login Check</button>
        </form>
      </div>

      <div class="card">
        <h2>3. Add Student</h2>
        <form method="post" action="{{ url_for('add_student_route') }}">
          <input name="roll_number" placeholder="Roll Number" required>
          <input name="first_name" placeholder="First Name" required>
          <input name="last_name" placeholder="Last Name">
          <input name="email" placeholder="Email">
          <input name="phone" placeholder="Phone">
          <input name="date_of_birth" placeholder="YYYY-MM-DD">
          <button type="submit">Add Student</button>
        </form>
      </div>

      <div class="card">
        <h2>5. Add Subject</h2>
        <form method="post" action="{{ url_for('add_subject_route') }}">
          <input name="subject_code" placeholder="Subject Code" required>
          <input name="subject_name" placeholder="Subject Name" required>
          <input name="description" placeholder="Description">
          <button type="submit">Add Subject</button>
        </form>
      </div>

      <div class="card">
        <h2>6. Add Mark</h2>
        <form method="post" action="{{ url_for('add_mark_route') }}">
          <input name="student_id" placeholder="Student ID" required>
          <input name="subject_id" placeholder="Subject ID" required>
          <input name="class_id" placeholder="Class ID" required>
          <input name="exam_name" placeholder="Exam Name" required>
          <input name="max_marks" placeholder="Max Marks" required>
          <input name="obtained_marks" placeholder="Obtained Marks" required>
          <input name="exam_date" placeholder="YYYY-MM-DD">
          <button type="submit">Add Mark</button>
        </form>
      </div>

      <div class="card">
        <h2>7. View Student Marks</h2>
        <form method="get" action="{{ url_for('view_student_mark_route') }}">
          <input name="student_id" placeholder="Student ID" required>
          <button type="submit">View Marks</button>
        </form>
      </div>

      <div class="card">
        <h2>8. Create Class</h2>
        <form method="post" action="{{ url_for('create_class_route') }}">
          <input name="class_name" placeholder="Class Name" required>
          <input name="section" placeholder="Section" required>
          <input name="academic_year" placeholder="Academic Year" required>
          <input name="class_teacher" placeholder="Class Teacher">
          <button type="submit">Create Class</button>
        </form>
      </div>

      <div class="card">
        <h2>9. Assign Student To Class</h2>
        <form method="post" action="{{ url_for('assign_student_route') }}">
          <input name="student_id" placeholder="Student ID" required>
          <input name="class_id" placeholder="Class ID" required>
          <input name="status" placeholder="Status (active/inactive)" value="active">
          <button type="submit">Assign Student</button>
        </form>
      </div>

      <div class="card">
        <h2>10. Delete Student</h2>
        <form method="post" action="{{ url_for('delete_student_route') }}">
          <input name="student_id" placeholder="Student ID" required>
          <button type="submit">Delete Student</button>
        </form>
      </div>

      <div class="card">
        <h2>11. Update Student</h2>
        <form method="post" action="{{ url_for('update_student_route') }}">
          <input name="student_id" placeholder="Student ID" required>
          <input name="roll_number" placeholder="Roll Number" required>
          <input name="first_name" placeholder="First Name" required>
          <input name="last_name" placeholder="Last Name">
          <input name="email" placeholder="Email">
          <input name="phone" placeholder="Phone">
          <input name="date_of_birth" placeholder="YYYY-MM-DD">
          <button type="submit">Update Student</button>
        </form>
      </div>

      <div class="card">
        <h2>12. Search Student</h2>
        <form method="get" action="{{ url_for('search_student_route') }}">
          <input name="keyword" placeholder="Search by roll/name/email/phone" required>
          <button type="submit">Search</button>
        </form>
      </div>

      <div class="card">
        <h2>4. View All Students</h2>
        <form method="get" action="{{ url_for('home') }}">
          <button type="submit">Refresh Student List</button>
        </form>
        <p class="muted">Students table is shown below.</p>
      </div>
    </div>

    <h2>Students</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Roll</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>DOB</th>
        </tr>
      </thead>
      <tbody>
        {% for s in students %}
        <tr>
          <td>{{ s.student_id }}</td>
          <td>{{ s.roll_number }}</td>
          <td>{{ s.first_name }}</td>
          <td>{{ s.last_name }}</td>
          <td>{{ s.email }}</td>
          <td>{{ s.phone }}</td>
          <td>{{ s.date_of_birth }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>

    {% if marks %}
      <h2>Student Marks</h2>
      <table>
        <thead>
          <tr>
            <th>Mark ID</th>
            <th>Exam</th>
            <th>Subject</th>
            <th>Class</th>
            <th>Max</th>
            <th>Obtained</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {% for m in marks %}
          <tr>
            <td>{{ m.mark_id }}</td>
            <td>{{ m.exam_name }}</td>
            <td>{{ m.subject_code }} - {{ m.subject_name }}</td>
            <td>{{ m.class_name }} {{ m.section }} ({{ m.academic_year }})</td>
            <td>{{ m.max_marks }}</td>
            <td>{{ m.obtained_marks }}</td>
            <td>{{ m.exam_date }}</td>
          </tr>
          {% endfor %}
        </tbody>
      </table>
    {% endif %}
  </div>
</body>
</html>
"""


def _clean_optional(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


@app.get("/")
def home():
  return render_template_string(LANDING_TEMPLATE, message=None, success=True)


@app.get("/admin")
def admin_dashboard():
    students = view_all_students()
    return render_template_string(PAGE_TEMPLATE, students=students, marks=[], message=None, success=True)


@app.post("/admin-signup")
def admin_signup_route():
  result = add_admin_user(
    request.form["full_name"],
    request.form["email"],
    request.form["username"],
    request.form["password"],
  )
  message = "Admin account created successfully" if result.get("success") else f"Admin signup failed: {result.get('error')}"
  return render_template_string(LANDING_TEMPLATE, message=message, success=bool(result.get("success")))


@app.post("/student-signup")
def student_signup_route():
  student_result = add_student(
    request.form["roll_number"],
    request.form["first_name"],
    _clean_optional(request.form.get("last_name")),
    _clean_optional(request.form.get("email")),
    _clean_optional(request.form.get("phone")),
    _clean_optional(request.form.get("date_of_birth")),
  )
  if not student_result.get("success"):
    message = f"Student signup failed: {student_result.get('error')}"
    return render_template_string(LANDING_TEMPLATE, message=message, success=False)

  login_result = add_user(
    int(student_result["student_id"]),
    request.form["username"],
    request.form["password"],
  )
  if not login_result.get("success"):
    message = f"Student created but login failed: {login_result.get('error')}"
    return render_template_string(LANDING_TEMPLATE, message=message, success=False)

  return render_template_string(LANDING_TEMPLATE, message="Student account created successfully", success=True)


@app.post("/add-user")
def add_user_route():
    result = add_user(int(request.form["student_id"]), request.form["username"], request.form["password"])
    message = "User created successfully" if result.get("success") else f"Add user failed: {result.get('error')}"
    return _render_home(message, bool(result.get("success")))


@app.post("/login-check")
def login_check_route():
    result = login_check(request.form["username"], request.form["password"])
    message = "Login successful" if result.get("success") else "Invalid username or password"
    return _render_home(message, bool(result.get("success")))


@app.post("/add-student")
def add_student_route():
    result = add_student(
        request.form["roll_number"],
        request.form["first_name"],
        _clean_optional(request.form.get("last_name")),
        _clean_optional(request.form.get("email")),
        _clean_optional(request.form.get("phone")),
        _clean_optional(request.form.get("date_of_birth")),
    )
    message = "Student added successfully" if result.get("success") else f"Add student failed: {result.get('error')}"
    return _render_home(message, bool(result.get("success")))


@app.post("/add-subject")
def add_subject_route():
    result = add_subject(
        request.form["subject_code"],
        request.form["subject_name"],
        _clean_optional(request.form.get("description")),
    )
    message = "Subject added successfully" if result.get("success") else f"Add subject failed: {result.get('error')}"
    return _render_home(message, bool(result.get("success")))


@app.post("/add-mark")
def add_mark_route():
    result = add_mark(
        int(request.form["student_id"]),
        int(request.form["subject_id"]),
        int(request.form["class_id"]),
        request.form["exam_name"],
        float(request.form["max_marks"]),
        float(request.form["obtained_marks"]),
        _clean_optional(request.form.get("exam_date")),
    )
    message = "Mark added successfully" if result.get("success") else f"Add mark failed: {result.get('error')}"
    return _render_home(message, bool(result.get("success")))


@app.get("/view-student-mark")
def view_student_mark_route():
    student_id = int(request.args.get("student_id", "0"))
    marks = view_student_mark(student_id)
    students = view_all_students()
    message = f"Showing marks for student ID {student_id}" if marks else "No marks found for this student"
    return render_template_string(PAGE_TEMPLATE, students=students, marks=marks, message=message, success=bool(marks))


@app.post("/create-class")
def create_class_route():
    result = create_class(
        request.form["class_name"],
        request.form["section"],
        request.form["academic_year"],
        _clean_optional(request.form.get("class_teacher")),
    )
    message = "Class created successfully" if result.get("success") else f"Create class failed: {result.get('error')}"
    return _render_home(message, bool(result.get("success")))


@app.post("/assign-student")
def assign_student_route():
    result = assign_student_to_class(
        int(request.form["student_id"]),
        int(request.form["class_id"]),
        request.form.get("status", "active"),
    )
    message = "Student assigned to class" if result.get("success") else f"Assignment failed: {result.get('error')}"
    return _render_home(message, bool(result.get("success")))


@app.post("/delete-student")
def delete_student_route():
    result = delete_student(int(request.form["student_id"]))
    message = "Student deleted successfully" if result.get("success") else f"Delete failed: {result.get('error', 'Student not found')}"
    return _render_home(message, bool(result.get("success")))


@app.post("/update-student")
def update_student_route():
    result = update_student(
        int(request.form["student_id"]),
        request.form["roll_number"],
        request.form["first_name"],
        _clean_optional(request.form.get("last_name")),
        _clean_optional(request.form.get("email")),
        _clean_optional(request.form.get("phone")),
        _clean_optional(request.form.get("date_of_birth")),
    )
    message = "Student updated successfully" if result.get("success") else f"Update failed: {result.get('error', 'Student not found')}"
    return _render_home(message, bool(result.get("success")))


@app.get("/search-student")
def search_student_route():
    keyword = request.args.get("keyword", "").strip()
    students = search_student(keyword) if keyword else view_all_students()
    message = f"Search results for '{keyword}'" if keyword else "Showing all students"
    return render_template_string(PAGE_TEMPLATE, students=students, marks=[], message=message, success=True)


def _render_home(message: str, success: bool):
    students = view_all_students()
    return render_template_string(PAGE_TEMPLATE, students=students, marks=[], message=message, success=success)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

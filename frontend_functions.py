import hashlib
import os
from typing import Any

import mysql.connector
from mysql.connector import Error


DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv("DB_PASSWORD", "aejaz0507"),
    "database": "student_management",
}


def _get_connection():
    """Create and return a database connection for frontend operations."""
    return mysql.connector.connect(**DB_CONFIG)


def _hash_password(password: str) -> str:
    """Hash passwords before storing/checking in database."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _ensure_admin_table(connection) -> None:
    """Create admins table if it does not exist."""
    cursor = connection.cursor()
    try:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS admins (
                admin_id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(120) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()
    finally:
        cursor.close()


def add_admin_user(full_name: str, email: str, username: str, password: str) -> dict[str, Any]:
    """Create a new admin user account."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        _ensure_admin_table(connection)
        cursor = connection.cursor()
        query = """
            INSERT INTO admins (full_name, email, username, password_hash)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (full_name, email, username, _hash_password(password)))
        connection.commit()
        return {"success": True, "admin_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def add_user(student_id: int, username: str, password: str) -> dict[str, Any]:
    """1. Add user login linked to a student."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO student_logins (student_id, username, password_hash)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (student_id, username, _hash_password(password)))
        connection.commit()
        return {"success": True, "login_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def login_check(username: str, password: str) -> dict[str, Any]:
    """2. Validate user login credentials."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT login_id, student_id, username, is_active
            FROM student_logins
            WHERE username = %s AND password_hash = %s
        """
        cursor.execute(query, (username, _hash_password(password)))
        row = cursor.fetchone()
        return {"success": row is not None, "user": row}
    except Error as err:
        return {"success": False, "error": str(err), "user": None}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def add_student(
    roll_number: str,
    first_name: str,
    last_name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    date_of_birth: str | None = None,
) -> dict[str, Any]:
    """3. Add a new student."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO students (roll_number, first_name, last_name, email, phone, date_of_birth)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            query,
            (roll_number, first_name, last_name, email, phone, date_of_birth),
        )
        connection.commit()
        return {"success": True, "student_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def view_all_students() -> list[dict[str, Any]]:
    """4. View all students."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM students ORDER BY student_id DESC")
        return cursor.fetchall()
    except Error:
        return []
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def add_subject(subject_code: str, subject_name: str, description: str | None = None) -> dict[str, Any]:
    """5. Add a subject."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO subjects (subject_code, subject_name, description)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (subject_code, subject_name, description))
        connection.commit()
        return {"success": True, "subject_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def add_mark(
    student_id: int,
    subject_id: int,
    class_id: int,
    exam_name: str,
    max_marks: float,
    obtained_marks: float,
    exam_date: str | None = None,
) -> dict[str, Any]:
    """6. Add marks for a student."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO marks (student_id, subject_id, class_id, exam_name, max_marks, obtained_marks, exam_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            query,
            (student_id, subject_id, class_id, exam_name, max_marks, obtained_marks, exam_date),
        )
        connection.commit()
        return {"success": True, "mark_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def view_student_mark(student_id: int) -> list[dict[str, Any]]:
    """7. View marks of a specific student."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT
                m.mark_id,
                m.exam_name,
                m.max_marks,
                m.obtained_marks,
                m.exam_date,
                s.subject_code,
                s.subject_name,
                c.class_name,
                c.section,
                c.academic_year
            FROM marks m
            JOIN subjects s ON s.subject_id = m.subject_id
            JOIN classes c ON c.class_id = m.class_id
            WHERE m.student_id = %s
            ORDER BY m.exam_date DESC, m.mark_id DESC
        """
        cursor.execute(query, (student_id,))
        return cursor.fetchall()
    except Error:
        return []
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def create_class(class_name: str, section: str, academic_year: str, class_teacher: str | None = None) -> dict[str, Any]:
    """8. Create a class."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO classes (class_name, section, academic_year, class_teacher)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (class_name, section, academic_year, class_teacher))
        connection.commit()
        return {"success": True, "class_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def assign_student_to_class(student_id: int, class_id: int, status: str = "active") -> dict[str, Any]:
    """9. Assign student to class."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO class_enrollments (student_id, class_id, status)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (student_id, class_id, status))
        connection.commit()
        return {"success": True, "enrollment_id": cursor.lastrowid}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def delete_student(student_id: int) -> dict[str, Any]:
    """10. Delete student by id."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM students WHERE student_id = %s", (student_id,))
        connection.commit()
        return {"success": cursor.rowcount > 0, "deleted_rows": cursor.rowcount}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def update_student(
    student_id: int,
    roll_number: str,
    first_name: str,
    last_name: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    date_of_birth: str | None = None,
) -> dict[str, Any]:
    """11. Update student details."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor()
        query = """
            UPDATE students
            SET roll_number = %s,
                first_name = %s,
                last_name = %s,
                email = %s,
                phone = %s,
                date_of_birth = %s
            WHERE student_id = %s
        """
        cursor.execute(
            query,
            (roll_number, first_name, last_name, email, phone, date_of_birth, student_id),
        )
        connection.commit()
        return {"success": cursor.rowcount > 0, "updated_rows": cursor.rowcount}
    except Error as err:
        return {"success": False, "error": str(err)}
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


def search_student(keyword: str) -> list[dict[str, Any]]:
    """12. Search student by roll number, name, email, or phone."""
    connection = None
    cursor = None
    try:
        connection = _get_connection()
        cursor = connection.cursor(dictionary=True)
        search_key = f"%{keyword}%"
        query = """
            SELECT *
            FROM students
            WHERE roll_number LIKE %s
               OR first_name LIKE %s
               OR last_name LIKE %s
               OR email LIKE %s
               OR phone LIKE %s
            ORDER BY student_id DESC
        """
        cursor.execute(
            query,
            (search_key, search_key, search_key, search_key, search_key),
        )
        return cursor.fetchall()
    except Error:
        return []
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

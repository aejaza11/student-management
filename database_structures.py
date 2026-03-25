import mysql.connector
from mysql.connector import Error


def create_connection():
	"""Create and return a MySQL connection for the student_management database."""
	try:
		connection = mysql.connector.connect(
			host="localhost",
			user="root",
			password="aejaz0507",
			database="student_management",
		)

		if connection.is_connected():
			print("Connected to MySQL database: student_management")
			return connection
	except Error as err:
		print(f"Error while connecting to MySQL: {err}")

	return None


def create_tables(connection):
	"""Create core tables for the student management portal."""
	table_queries = [
		"""
		CREATE TABLE IF NOT EXISTS students (
			student_id INT AUTO_INCREMENT PRIMARY KEY,
			roll_number VARCHAR(30) UNIQUE NOT NULL,
			first_name VARCHAR(100) NOT NULL,
			last_name VARCHAR(100),
			email VARCHAR(255) UNIQUE,
			phone VARCHAR(20),
			date_of_birth DATE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
		""",
		"""
		CREATE TABLE IF NOT EXISTS student_logins (
			login_id INT AUTO_INCREMENT PRIMARY KEY,
			student_id INT NOT NULL,
			username VARCHAR(100) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			last_login DATETIME,
			is_active BOOLEAN DEFAULT TRUE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (student_id) REFERENCES students(student_id)
				ON DELETE CASCADE
		)
		""",
		"""
		CREATE TABLE IF NOT EXISTS subjects (
			subject_id INT AUTO_INCREMENT PRIMARY KEY,
			subject_code VARCHAR(30) UNIQUE NOT NULL,
			subject_name VARCHAR(120) NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
		""",
		"""
		CREATE TABLE IF NOT EXISTS classes (
			class_id INT AUTO_INCREMENT PRIMARY KEY,
			class_name VARCHAR(100) NOT NULL,
			section VARCHAR(20),
			academic_year VARCHAR(20) NOT NULL,
			class_teacher VARCHAR(120),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE KEY unique_class_section_year (class_name, section, academic_year)
		)
		""",
		"""
		CREATE TABLE IF NOT EXISTS class_enrollments (
			enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
			student_id INT NOT NULL,
			class_id INT NOT NULL,
			enrollment_date DATE DEFAULT (CURRENT_DATE),
			status VARCHAR(20) DEFAULT 'active',
			UNIQUE KEY unique_student_class (student_id, class_id),
			FOREIGN KEY (student_id) REFERENCES students(student_id)
				ON DELETE CASCADE,
			FOREIGN KEY (class_id) REFERENCES classes(class_id)
				ON DELETE CASCADE
		)
		""",
		"""
		CREATE TABLE IF NOT EXISTS marks (
			mark_id INT AUTO_INCREMENT PRIMARY KEY,
			student_id INT NOT NULL,
			subject_id INT NOT NULL,
			class_id INT NOT NULL,
			exam_name VARCHAR(100) NOT NULL,
			max_marks DECIMAL(5,2) NOT NULL,
			obtained_marks DECIMAL(5,2) NOT NULL,
			exam_date DATE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (student_id) REFERENCES students(student_id)
				ON DELETE CASCADE,
			FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
				ON DELETE CASCADE,
			FOREIGN KEY (class_id) REFERENCES classes(class_id)
				ON DELETE CASCADE
		)
		""",
		"""
		CREATE TABLE IF NOT EXISTS student_records (
			record_id INT AUTO_INCREMENT PRIMARY KEY,
			student_id INT NOT NULL,
			class_id INT,
			record_type VARCHAR(100) NOT NULL,
			record_title VARCHAR(150) NOT NULL,
			record_details TEXT,
			record_date DATE DEFAULT (CURRENT_DATE),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (student_id) REFERENCES students(student_id)
				ON DELETE CASCADE,
			FOREIGN KEY (class_id) REFERENCES classes(class_id)
				ON DELETE SET NULL
		)
		""",
	]

	try:
		cursor = connection.cursor()
		for query in table_queries:
			cursor.execute(query)
		connection.commit()
		print("All required tables created successfully.")
	except Error as err:
		print(f"Error while creating tables: {err}")
	finally:
		if 'cursor' in locals():
			cursor.close()


if __name__ == "__main__":
	db_connection = create_connection()
	if db_connection:
		create_tables(db_connection)
		db_connection.close()
		print("MySQL connection closed")



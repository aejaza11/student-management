# Student Management

This project now includes:

- Python MySQL backend logic in `frontend_functions.py`
- Flask API bridge in `app.py`
- React + TypeScript frontend in `frontend/`
- Vite dev server with HMR (`npm run dev`)

## 1. Backend Setup (Flask + MySQL)

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Optional (recommended) DB password environment variable:

```bash
set DB_PASSWORD=your_mysql_password
```

Run backend API:

```bash
python app.py
```

Backend runs at:

```text
http://127.0.0.1:5000
```

## 2. Frontend Setup (React + TypeScript + HMR)

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run frontend dev server with HMR:

```bash
npm run dev
```

Frontend runs at:

```text
http://127.0.0.1:5173
```

## 3. API Connection

Frontend calls backend using:

```text
http://127.0.0.1:5000/api
```

Override this by setting `VITE_API_BASE_URL` in frontend env if needed.

## 4. Functions Connected

The frontend dashboard includes actions for all backend functions:

1. Create admin
2. Add user login
3. Login check
4. Add student
5. View all students
6. Add subject
7. Add marks
8. Create class
9. Assign student to class
10. Delete student
11. Update student
12. Search student
13. View marks by student id

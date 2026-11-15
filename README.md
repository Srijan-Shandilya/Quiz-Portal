# Quiz & Examination Portal

A web-based quiz application where students can register, log in, attempt timed multiple-choice quizzes and see their scores, and teachers/admins can create and manage quizzes through Django Admin.

Built as a college project by Srijan.

## Features

**Students**
- Register, log in and log out
- Dashboard with available quizzes and previous results
- Attempt MCQ quizzes with a countdown timer
- Automatic score calculation after submission
- Each quiz can be attempted only once

**Admins / Teachers (Django Admin)**
- Create, edit and delete quizzes
- Add questions and answer options, and mark the correct option
- Mark quizzes active or inactive
- View all student attempts and scores

## Tech Stack

| Part | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS, React Router, Fetch API |
| Backend | Python, Django (plain JSON views, no REST framework) |
| Database | SQLite |
| Authentication | Django sessions |
| Tools | VS Code, Git, GitHub, Postman |

## Project Structure

```
Quiz-Portal/
├── backend/
│   ├── config/       (Django project settings and main URLs)
│   ├── accounts/     (register, login, logout, current user)
│   ├── quizzes/      (Quiz, Question, AnswerOption models and quiz APIs)
│   ├── results/      (QuizAttempt model, submit and results APIs)
│   ├── exams/        (created but not used)
│   └── manage.py
└── frontend/
    └── src/
        ├── components/   (Navbar)
        └── pages/        (Login, Register, Dashboard, QuizAttempt)
```

## How to Run

The database file (`db.sqlite3`) is not uploaded, so a new database is created on your machine.

### 1. Backend (Django)

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend runs at http://127.0.0.1:8000/ and the admin panel at http://127.0.0.1:8000/admin/

### 2. Frontend (React)

Open a second terminal:

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173/ in the browser. The Vite dev server forwards every `/api/...` request to the Django server, so keep both running.

### 3. Add a quiz (as admin)

1. Log in at `/admin/` with the superuser account.
2. Add a Quiz (title, duration in minutes, keep "Is active" ticked).
3. Add Questions: choose the quiz, write the question, fill the options and tick exactly one correct option.
4. Log in as a student on the React site to see and attempt the quiz.

## API Endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | /api/quizzes/ | List active quizzes |
| GET | /api/quizzes/<id>/ | Quiz with questions and options (correct answers are never sent) |
| POST | /api/accounts/register/ | Create a student account |
| POST | /api/accounts/login/ | Log in |
| POST | /api/accounts/logout/ | Log out |
| GET | /api/accounts/me/ | Currently logged-in user |
| POST | /api/results/submit/<quiz_id>/ | Submit answers; the server calculates the score |
| GET | /api/results/my/ | Logged-in student's own results |

## Key Design Decisions

- The score is calculated on the server, so students cannot change their marks from the browser.
- `is_correct` is never included in the quiz API response.
- A database unique constraint (user + quiz) stops a student from submitting the same quiz twice.
- Only multiple-choice questions are supported, to keep the scope simple.

## Testing

Manual test cases for the browser and Postman are listed in [TESTING.md](TESTING.md).

## Screenshots

## Screenshots

### Student side

**Register**

![Register page](docs/screenshots/01-register.png)

**Login**

![Login page](docs/screenshots/02-login.png)

**Dashboard with available quizzes and previous results**

![Dashboard](docs/screenshots/03-dashboard.png)

**Quiz page with countdown timer**

![Quiz page with timer](docs/screenshots/04-quiz-timer.png)

**Result after submission**

![Result page](docs/screenshots/05-result.png)

### Admin side (Django Admin)

**Adding a question with answer options**

![Admin add question](docs/screenshots/06-admin-add-question.png)

**Quiz list**

![Django Admin quiz list](docs/screenshots/07-admin-quizzes.png)

**Student attempts and scores**

![Admin quiz attempts](docs/screenshots/08-admin-attempts.png)


## Limitations and Future Improvements

- CSRF protection is switched off on the POST views for simplicity; it should be enabled for production.
- The timer runs only in the browser. Refreshing the page restarts it, and the server does not enforce the time limit. Future work: store the start time on the server.
- Answers are saved only when the quiz is submitted.
- The "exactly one correct option" rule is checked in Django Admin, not at database level.
- Password rules are minimal (6 characters); Django's password validators are not used.
- Teachers use Django Admin; there is no separate React teacher dashboard.
- The Vite proxy works only in development; deployment needs CORS or serving the React build from Django.
- There are no automated tests yet.
- Settings are development settings (DEBUG on).
- There is no login rate limiting and no email verification.
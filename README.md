# Quiz and Examination Portal

A web-based Quiz and Examination Portal developed as a college group project by a team of five members.

The project aims to provide a platform where users can participate in quizzes and examinations, while administrators can manage quizzes, questions, exams, and results.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Python
- Django 6.1.3
- SQLite

### Development Tools
- Visual Studio Code
- Git and GitHub
- Postman
- Node.js and npm

## Project Structure

```text
Quiz-Portal/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── accounts/
│   ├── quizzes/
│   ├── exams/
│   ├── results/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

## Setup and Installation

### Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Quiz-Portal
```

### 2. Set Up the Backend

Navigate to the backend folder:

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required dependencies:

```powershell
pip install -r requirements.txt
```

Apply database migrations:

```powershell
python manage.py migrate
```

Create an administrator account:

```powershell
python manage.py createsuperuser
```

Start the Django development server:

```powershell
python manage.py runserver
```

Backend server:

`http://127.0.0.1:8000/`

### 3. Set Up the Frontend

Open a second terminal and navigate to the frontend folder:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL displayed in the terminal.

## Database

The project uses SQLite as its database.

The database file is generated locally by Django when migrations are applied. It is not included in the GitHub repository.

## Development Status

The project is currently under development. Features and functionality will be added progressively.
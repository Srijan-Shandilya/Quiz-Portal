# Testing Documentation

All tests were done manually, using the browser for the React pages and Postman for the APIs.

## 1. Authentication

| ID | Feature | Steps | Expected result | Result |
|---|---|---|---|---|
| T1 | Register | Open /register, enter a new username and a password of 6+ characters | Account is created and the dashboard opens | Pass |
| T2 | Duplicate username | Register with a username that already exists | Error: "This username is already taken." | Pass |
| T3 | Short password | Register with a password of fewer than 6 characters | Error: "Password must be at least 6 characters." | Pass |
| T4 | Login | Log in with a correct username and password | Dashboard opens | Pass |
| T5 | Wrong password | Log in with a wrong password | Error: "Invalid username or password." | Pass |
| T6 | Stay logged in | Log in, then refresh the page | User stays logged in | Pass |
| T7 | Logout | Click Logout | Login page opens | Pass |
| T8 | Protected page | After logout, open /dashboard directly | Redirected to the login page | Pass |

## 2. Quizzes and Dashboard

| ID | Feature | Steps | Expected result | Result |
|---|---|---|---|---|
| T9 | Quiz list | Log in and open the dashboard | Active quizzes appear with question count and duration | Pass |
| T10 | Inactive quiz | In Django Admin, untick "Is active" for a quiz | The quiz disappears from the dashboard | Pass |
| T11 | No answer leak | Open /api/quizzes/1/ (or the Network tab on the quiz page) | The response contains no `is_correct` field | Pass |

## 3. Attempting a Quiz

| ID | Feature | Steps | Expected result | Result |
|---|---|---|---|---|
| T12 | Start quiz | Click "Start Quiz" | Questions, options and a countdown timer appear | Pass |
| T13 | Single choice | Select one option, then another in the same question | Only one option stays selected | Pass |
| T14 | Unanswered warning | Leave a question blank and click Submit | A confirmation box appears; Cancel stops the submit | Pass |
| T15 | Submit and score | Answer all questions and submit | The score is shown, for example "2 / 3" | Pass |
| T16 | Attempted badge | Go back to the dashboard | The quiz shows "Already attempted" and the result is in the table | Pass |
| T17 | Timer warning | Wait until 60 seconds remain | The timer turns red | Pass |
| T18 | Auto-submit | Start a 1-minute quiz and do nothing | The quiz is submitted automatically at 00:00 | Pass |

## 4. Security and Rules (Postman)

| ID | Feature | Steps | Expected result | Result |
|---|---|---|---|---|
| T19 | Submit without login | POST /api/results/submit/1/ while logged out | Status 401, "Please log in first." | Pass |
| T20 | Repeat attempt | Submit the same quiz again as the same student | Status 400, "You have already submitted this quiz." | Pass |
| T21 | Own results only | Log in as a new student and open /api/results/my/ | Empty list; other students' results are not shown | Pass |
| T22 | One correct option | In Django Admin, tick two correct options for one question | Error: "Exactly one option must be marked as correct." | Pass |
| T23 | Minimum options | In Django Admin, save a question with fewer than 2 options | Error: "Please add at least 2 answer options." | Pass |
| T24 | Admin attempts | Open Quiz attempts in Django Admin | Student scores are listed correctly | Pass |

## Known Issues

See the "Limitations and Future Improvements" section in README.md.
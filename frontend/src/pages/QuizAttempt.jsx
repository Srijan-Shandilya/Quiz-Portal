import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './QuizAttempt.css'

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function QuizAttempt() {
  const { quizId } = useParams()

  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/quizzes/${quizId}/`)
      .then((response) =>
        response.json().then((data) => ({ ok: response.ok, data }))
      )
      .then((res) => {
        if (res.ok) {
          setQuiz(res.data)
          setTimeLeft(res.data.duration_minutes * 60)
        } else {
          setError(res.data.error)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load the quiz.')
        setLoading(false)
      })
  }, [quizId])

  useEffect(() => {
    if (timeLeft === null || result || submitting) {
      return
    }

    if (timeLeft <= 0) {
      if (!error) {
        submitQuiz(true)
      }
      return
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [timeLeft, result, submitting])

  function selectAnswer(questionId, optionId) {
    setAnswers({ ...answers, [questionId]: optionId })
  }

  function submitQuiz(auto) {
    if (submitting) {
      return
    }

    const unanswered = quiz.questions.length - Object.keys(answers).length
    if (!auto && unanswered > 0) {
      const sure = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      )
      if (!sure) {
        return
      }
    }

    setSubmitting(true)
    setError('')

    fetch(`/api/results/submit/${quizId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
      .then((response) =>
        response.json().then((data) => ({ ok: response.ok, data }))
      )
      .then((res) => {
        if (res.ok) {
          setResult(res.data)
        } else {
          setError(res.data.error)
        }
        setSubmitting(false)
      })
      .catch(() => {
        setError('Could not submit. Please check your connection and try again.')
        setSubmitting(false)
      })
  }

  if (loading) {
    return <p className="message">Loading...</p>
  }

  if (!quiz) {
    return (
      <div className="card">
        <p className="error">{error}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    )
  }

  if (result) {
    return (
      <div className="card result-card">
        <h2>Quiz submitted!</h2>
        <p>{result.quiz}</p>
        <p className="big-score">
          {result.score} / {result.total_questions}
        </p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    )
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="card">
        <p>This quiz has no questions yet.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="quiz-header">
        <div>
          <h2>{quiz.title}</h2>
          {quiz.description && <p>{quiz.description}</p>}
        </div>
        <div className={timeLeft <= 60 ? 'timer timer-low' : 'timer'}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {quiz.questions.map((question, index) => (
        <div className="question-card" key={question.id}>
          <h4>
            Q{index + 1}. {question.text}
          </h4>
          {question.options.map((option) => (
            <label className="option" key={option.id}>
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answers[question.id] === option.id}
                onChange={() => selectAnswer(question.id, option.id)}
              />
              {option.text}
            </label>
          ))}
        </div>
      ))}

      {error && <p className="error">{error}</p>}

      <button
        className="submit-btn"
        onClick={() => submitQuiz(false)}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  )
}

export default QuizAttempt
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

function getJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Request failed')
    }
    return response.json()
  })
}

function Dashboard({ user }) {
  const [quizzes, setQuizzes] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getJson('/api/quizzes/'), getJson('/api/results/my/')])
      .then(([quizData, resultData]) => {
        setQuizzes(quizData)
        setResults(resultData)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load data from the server.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="message">Loading...</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  const attemptedIds = results.map((result) => result.quiz_id)

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>

      <h3 className="section-title">Available Quizzes</h3>
      {quizzes.length === 0 && <p>No quizzes are available right now.</p>}
      {quizzes.map((quiz) => (
        <div className="quiz-card" key={quiz.id}>
          <div>
            <h4>{quiz.title}</h4>
            {quiz.description && <p>{quiz.description}</p>}
            <p className="quiz-meta">
              {quiz.question_count} questions | {quiz.duration_minutes} minutes
            </p>
          </div>
          {attemptedIds.includes(quiz.id) ? (
            <span className="done-badge">Already attempted</span>
          ) : (
            <Link className="start-link" to={`/quiz/${quiz.id}`}>
              Start Quiz
            </Link>
          )}
        </div>
      ))}

      <h3 className="section-title">Previous Results</h3>
      {results.length === 0 && <p>You have not attempted any quiz yet.</p>}
      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.quiz_title}</td>
                <td>
                  {result.score} / {result.total_questions}
                </td>
                <td>{new Date(result.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Dashboard
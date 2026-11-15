import { Link, useParams } from 'react-router-dom'

function QuizAttempt() {
  const { quizId } = useParams()

  return (
    <div className="card">
      <h2>Quiz {quizId}</h2>
      <p>The quiz page will be built in the next stage.</p>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  )
}

export default QuizAttempt
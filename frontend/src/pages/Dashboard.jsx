function Dashboard({ user }) {
  return (
    <div className="card">
      <h2>Welcome, {user.username}!</h2>
      <p>Your quizzes and results will appear here.</p>
    </div>
  )
}

export default Dashboard
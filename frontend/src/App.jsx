import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import QuizAttempt from './pages/QuizAttempt.jsx'
import Register from './pages/Register.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/accounts/me/')
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        return null
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="message">Loading...</p>
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} />}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/quiz/:quizId"
            element={user ? <QuizAttempt /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </>
  )
}

export default App
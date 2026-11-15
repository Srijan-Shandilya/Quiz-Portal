import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  function handleLogout() {
    fetch('/api/accounts/logout/', { method: 'POST' }).then(() => {
      setUser(null)
      navigate('/login')
    })
  }

  return (
    <nav className="navbar">
      <span className="brand">Quiz Portal</span>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout ({user.username})</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
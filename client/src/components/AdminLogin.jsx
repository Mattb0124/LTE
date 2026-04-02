import { useState } from 'react'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        setError('Invalid password')
        return
      }

      onSuccess()
    } catch {
      setError('Connection error')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="section-line" style={{ margin: '0 auto 1.5rem' }}></div>
        <h2>Admin Access</h2>
        <p>Enter the admin password to view leads.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-submit" style={{ marginTop: '1rem' }}>
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  )
}

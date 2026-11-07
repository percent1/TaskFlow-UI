
import { useState } from 'react'
import api from '../api/axios'
import './Auth.css'

function Auth({ onLogin }) {
  // Track whether the user is registering or logging in.
  const [isRegistering, setIsRegistering] = useState(false)

  // Store form values.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Track request status and error messages.
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      if (isRegistering) {
        // Register a new user.
        await api.post('/users', {
          name: name.trim(),
          email: email.trim(),
          password,
        })

        // Switch to login after successful registration.
        setIsRegistering(false)
        setPassword('')
        setError('')
        return
      }

      // Authenticate an existing user.
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })

      const token = response.data.token

      if (!token) {
        throw new Error('The server did not return an authentication token.')
      }

      // Pass the token to the main application.
      onLogin(token, response.data.name)
    } catch (err) {
      const responseMessage = err.response?.data?.message

      setError(
        responseMessage ||
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setIsRegistering(!isRegistering)
    setError('')
    setPassword('')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand-icon">✓</div>
          <h1>TaskFlow</h1>
          <p>Organise your work, achieve your goals.</p>
        </div>

        <div className="auth-heading">
          <h2>
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </h2>

          <p>
            {isRegistering
              ? 'Sign up to get started with TaskFlow.'
              : 'Sign in to continue to your workspace.'}
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {isRegistering && (
            <>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            minLength={isRegistering ? 8 : undefined}
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegistering
                ? 'Create Account'
                : 'Sign In'}
          </button>

        </form>

        <div className="auth-switch">
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button type="button" onClick={switchMode}>
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Auth

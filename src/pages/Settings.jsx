import { useEffect, useState } from 'react'
import api from '../api/axios'
import './Settings.css'

function Settings({ onNameUpdated }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [savingName, setSavingName] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load the authenticated user's account details.
  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await api.get('/users/me')

        setName(response.data.name)
        setEmail(response.data.email)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load your account details.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadAccount()
  }, [])

  // Update the user's name.
  async function handleNameUpdate(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Name cannot be empty.')
      return
    }

    setSavingName(true)

    try {
      const response = await api.put('/users/me', {
        name: name.trim(),
      })

      setName(response.data.name)
      onNameUpdated?.(response.data.name)
      setSuccess('Your name has been updated successfully.')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update your name.'
      )
    } finally {
      setSavingName(false)
    }
  }

  // Change the user's password.
  async function handlePasswordUpdate(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (newPassword.length < 8) {
      setError('Your new password must contain at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Your new passwords do not match.')
      return
    }

    setSavingPassword(true)

    try {
      await api.put('/users/me/password', {
        currentPassword,
        newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setSuccess('Your password has been changed successfully.')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to change your password.'
      )
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="settings-content">
        <p>Loading account settings...</p>
      </div>
    )
  }

  return (
    <div className="settings-content">
      <div className="settings-heading">
        <h1>Account Settings</h1>
        <p>Manage your personal information and security.</p>
      </div>

      {error && (
        <div className="settings-message settings-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="settings-message settings-success" role="status">
          {success}
        </div>
      )}

      {/* Profile information */}
      <section className="settings-card">
        <div className="settings-card-heading">
          <h2>Personal Information</h2>
          <p>Update your account name.</p>
        </div>

        <form onSubmit={handleNameUpdate}>
          <label htmlFor="account-name">Full Name</label>

          <input
            id="account-name"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            maxLength={100}
            required
          />

          <label htmlFor="account-email">Email Address</label>

          <input
            id="account-email"
            type="email"
            value={email}
            readOnly
          />

          <button
            type="submit"
            className="primary-button"
            disabled={savingName}
          >
            {savingName ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Password security */}
      <section className="settings-card">
        <div className="settings-card-heading">
          <h2>Change Password</h2>
          <p>Choose a strong password to protect your account.</p>
        </div>

        <form onSubmit={handlePasswordUpdate}>
          <label htmlFor="current-password">Current Password</label>

          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={event => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <label htmlFor="new-password">New Password</label>

          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm-password">Confirm New Password</label>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            className="primary-button"
            disabled={savingPassword}
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Settings

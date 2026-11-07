
import { useEffect, useState } from 'react'
import './App.css'
import Auth from './components/Auth'
import api from './api/axios'

// Convert backend task properties into frontend task properties.
function formatTask(task) {
  return {
    id: task.id,
    title: task.tittle,
    description: task.description || '',
    completed: task.completed,
    dueDate: task.dueDate || '',
  }
}

function App() {
  // Authentication state.
  const [token, setToken] = useState(
    () => sessionStorage.getItem('token')
  )

  // Task state.
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Dashboard controls.
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  // New task form state.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Called after successful login.
  function handleLogin(newToken) {
    sessionStorage.setItem('token', newToken)
    setToken(newToken)
  }

  // Log out and remove the stored token.
  function handleLogout() {
    sessionStorage.removeItem('token')
    setToken(null)
    setTasks([])
    setError('')
    setShowForm(false)
  }

  // Load tasks belonging to the authenticated user.
  useEffect(() => {
    if (!token) return

    async function fetchTasks() {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/tasks')
        setTasks(response.data.map(formatTask))
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem('token')
          setToken(null)
          setError('Your session has expired. Please sign in again.')
        } else {
          setError(
            err.response?.data?.message ||
            'Unable to load your tasks. Please try again.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [token])

  // Add a new task through the backend API.
  async function addTask(event) {
    event.preventDefault()

    if (!title.trim()) return

    setError('')

    try {
      const response = await api.post('/tasks', {
        tittle: title.trim(),
        description: description.trim(),
        completed: false,
        dueDate: dueDate || null,
      })

      setTasks(previousTasks => [
        formatTask(response.data),
        ...previousTasks,
      ])

      setTitle('')
      setDescription('')
      setDueDate('')
      setShowForm(false)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create the task. Please try again.'
      )
    }
  }

  // Update task completion status through the backend API.
  async function toggleTask(id) {
    const task = tasks.find(item => item.id === id)

    if (!task) return

    setError('')

    try {
      const response = await api.put(`/tasks/${id}`, {
        tittle: task.title,
        description: task.description,
        completed: !task.completed,
        dueDate: task.dueDate || null,
      })

      const updatedTask = formatTask(response.data)

      setTasks(previousTasks =>
        previousTasks.map(item =>
          item.id === id ? updatedTask : item
        )
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update the task. Please try again.'
      )
    }
  }

  // Delete a task through the backend API.
  async function deleteTask(id) {
    setError('')

    try {
      await api.delete(`/tasks/${id}`)

      setTasks(previousTasks =>
        previousTasks.filter(task => task.id !== id)
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to delete the task. Please try again.'
      )
    }
  }

  // Dashboard statistics.
  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    task => task.completed
  ).length

  const activeTasks = totalTasks - completedTasks

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  // Filter tasks for display.
  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  })

  // Show login/register screen when no token exists.
  if (!token) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">✓</div>
          <h2>TaskFlow</h2>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">MENU</p>

          <a href="#dashboard" className="nav-item active">
            <span>▦</span>
            Dashboard
          </a>

          <a href="#tasks" className="nav-item">
            <span>☑</span>
            My Tasks
          </a>

          <p className="nav-label">PREFERENCES</p>

          <a href="#settings" className="nav-item">
            <span>⚙</span>
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <p>TaskFlow</p>
          <span>Stay organised. Stay productive.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
          </div>

          <div className="topbar-actions">
            <div className="user-profile">
              <div className="avatar">U</div>
              <span>My Account</span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Welcome section */}
        <section className="welcome-section" id="dashboard">
          <div>
            <p className="welcome-date">YOUR WORKSPACE</p>
            <h1>Welcome back!</h1>
            <p className="welcome-description">
              Here's an overview of your tasks and productivity.
            </p>
          </div>
        </section>

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">▦</div>
            <div>
              <p>Total Tasks</p>
              <h2>{totalTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">◷</div>
            <div>
              <p>Active Tasks</p>
              <h2>{activeTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <p>Completed Tasks</p>
              <h2>{completedTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">↗</div>
            <div>
              <p>Completion Rate</p>
              <h2>{completionRate}%</h2>
            </div>
          </div>
        </section>

        {/* Tasks section */}
        <section className="tasks-section" id="tasks">
          <div className="section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>Manage and track your daily activities.</p>
            </div>

            <div className="task-header-actions">
              <div className="task-filters">
                {['All', 'Active', 'Completed'].map(option => (
                  <button
                    key={option}
                    className={
                      filter === option
                        ? 'filter-button selected'
                        : 'filter-button'
                    }
                    onClick={() => setFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setError('')
                  setShowForm(true)
                }}
              >
                + Add New Task
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          {/* Task list */}
          <div className="task-list">
            {loading ? (
              <div className="empty-state">
                <h3>Loading tasks...</h3>
                <p>Please wait while we retrieve your tasks.</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks found</h3>
                <p>Create a task to start organising your work.</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div className="task-card" key={task.id}>
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Mark ${task.title} as ${
                        task.completed ? 'active' : 'completed'
                      }`}
                    />
                  </div>

                  <div className="task-details">
                    <h3
                      className={
                        task.completed ? 'completed-title' : ''
                      }
                    >
                      {task.title}
                    </h3>

                    <p>{task.description}</p>

                    {task.dueDate && (
                      <small>Due: {task.dueDate}</small>
                    )}
                  </div>

                  <div className="task-meta">
                    <span
                      className={
                        task.completed
                          ? 'status-completed'
                          : 'status-active'
                      }
                    >
                      {task.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Add task modal */}
        {showForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowForm(false)}
          >
            <div
              className="task-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={event => event.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2 id="modal-title">Create New Task</h2>
                  <p>Add a new task to your workspace.</p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                >
                  ✕
                </button>
              </div>

              <form className="task-form" onSubmit={addTask}>
                <label htmlFor="task-title">Task Title</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  maxLength={100}
                  required
                />

                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  placeholder="Add some details..."
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  maxLength={500}
                />

                <label htmlFor="task-due-date">Due Date</label>
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={event => setDueDate(event.target.value)}
                />

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    Save Task
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <footer className="dashboard-footer">
          <p>
            © 2026 TaskFlow. Built to help you stay productive.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App

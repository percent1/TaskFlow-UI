
import { useEffect, useState } from 'react'
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom'

import './App.css'
import Auth from './components/Auth'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TaskDetails from './pages/TaskDetails'
import Settings from './pages/Settings'
import api from './api/axios'

// Convert backend task properties into frontend task properties.
function formatTask(task) {
  return {
    id: task.id,
    title: task.tittle,
    description: task.description || '',
    completed: task.completed,
    dueDate: task.dueDate || '',
    createdAt: task.createdAt || null,
  }
}

// Find and display an individual task.
function TaskDetailsRoute({ tasks, toggleTask }) {
  const { taskId } = useParams()

  const selectedTask = tasks.find(
    task => String(task.id) === taskId
  )

  return (
    <TaskDetails
      task={selectedTask}
      toggleTask={toggleTask}
    />
  )
}

function App() {
  const location = useLocation()

  // Authentication state.
  const [token, setToken] = useState(
    () => sessionStorage.getItem('token')
  )

  // Current authenticated user's name.
  const [currentUserName, setCurrentUserName] = useState('User')

  // Task state.
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Task page controls.
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  // New task form state.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  // Called after successful login.
  function handleLogin(newToken, userName) {
    sessionStorage.setItem('token', newToken)
    setToken(newToken)
    setCurrentUserName(userName || 'User')
  }

  // Log out and remove the stored token.
  function handleLogout() {
    sessionStorage.removeItem('token')
    setToken(null)
    setTasks([])
    setError('')
    setShowForm(false)
    setCurrentUserName('User')
  }

  // Load current user details.
  useEffect(() => {
    if (!token) return

    async function fetchCurrentUser() {
      try {
        const response = await api.get('/users/me')
        setCurrentUserName(response.data.name)
      } catch (err) {
        if (err.response?.status === 401) {
          handleLogout()
          setError('Your session has expired. Please sign in again.')
        }
      }
    }

    fetchCurrentUser()
  }, [token])

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
          setCurrentUserName('User')
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

  // Close the task modal when leaving the Tasks page.
  useEffect(() => {
    if (location.pathname !== '/tasks') {
      setShowForm(false)
    }
  }, [location.pathname])

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

  // Show login/register screen when no token exists.
  if (!token) {
    return <Auth onLogin={handleLogin} />
  }

  const isTasksPage = location.pathname === '/tasks'
  const isTaskDetailsPage = location.pathname.startsWith('/tasks/')
  const isSettingsPage = location.pathname === '/settings'

  let currentPage = 'Dashboard'

  if (isTasksPage) {
    currentPage = 'My Tasks'
  } else if (isTaskDetailsPage) {
    currentPage = 'Task Details'
  } else if (isSettingsPage) {
    currentPage = 'Settings'
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">✓</div>
          <h2>TaskFlow</h2>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">MENU</p>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span>▦</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive || isTaskDetailsPage
                ? 'nav-item active'
                : 'nav-item'
            }
          >
            <span>☑</span>
            My Tasks
          </NavLink>

          <p className="nav-label">PREFERENCES</p>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span>⚙</span>
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>TaskFlow</p>
          <span>Stay organised. Stay productive.</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Workspace / {currentPage}
            </p>
          </div>

          <div className="topbar-actions">
            <div className="user-profile">
              <div className="avatar">
                {currentUserName.charAt(0).toUpperCase()}
              </div>

              <span>{currentUserName}</span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Page routing */}
        <Routes>
          <Route
            path="/"
            element={<Dashboard tasks={tasks} />}
          />

          <Route
            path="/tasks"
            element={
              <Tasks
                tasks={tasks}
                loading={loading}
                error={error}
                filter={filter}
                setFilter={setFilter}
                setError={setError}
                setShowForm={setShowForm}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
              />
            }
          />

          <Route
            path="/tasks/:taskId"
            element={
              <TaskDetailsRoute
                tasks={tasks}
                toggleTask={toggleTask}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings
                onNameUpdated={setCurrentUserName}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

        {/* Add task modal */}
        {showForm && isTasksPage && (
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

                <label htmlFor="task-description">
                  Description
                </label>

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
                  <button
                    type="submit"
                    className="primary-button"
                  >
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

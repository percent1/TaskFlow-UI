
import { useState } from 'react'
import './App.css'

function App() {
  // Store the tasks in React state.
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete Spring Boot API',
      description: 'Finish backend development and testing',
      completed: true,
      priority: 'High',
    },
    {
      id: 2,
      title: 'Build React dashboard',
      description: 'Create the main Task Manager interface',
      completed: false,
      priority: 'High',
    },
    {
      id: 3,
      title: 'Connect frontend to API',
      description: 'Integrate React with the Spring Boot backend',
      completed: false,
      priority: 'Medium',
    },
    {
      id: 4,
      title: 'Prepare project documentation',
      description: 'Document the development process',
      completed: true,
      priority: 'Low',
    },
  ])

  // Store the selected task filter.
  const [filter, setFilter] = useState('All')

  // Control the visibility of the task form.
  const [showForm, setShowForm] = useState(false)

  // Store the new task form values.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')

  // Calculate task statistics.
  const completedCount = tasks.filter(task => task.completed).length
  const activeCount = tasks.length - completedCount

  // Filter tasks based on their completion status.
  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed
    if (filter === 'Completed') return task.completed

    return true
  })

  // Mark a task as completed or active.
  function toggleTask(id) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  // Create a new task.
  function addTask(event) {
    event.preventDefault()

    if (!title.trim()) return

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
    }

    setTasks(currentTasks => [...currentTasks, newTask])

    // Reset the form.
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setShowForm(false)
    setFilter('All')
  }

  // Delete an existing task.
  function deleteTask(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) return

    setTasks(currentTasks =>
      currentTasks.filter(task => task.id !== id)
    )
  }

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">✓</div>
          <h2>TaskFlow</h2>
        </div>

        <p className="menu-heading">MENU</p>

        <nav className="navigation">

          <a href="#dashboard" className="nav-link active">
            <span>▦</span> Dashboard
          </a>

          <a href="#tasks" className="nav-link">
            <span>☑</span> My Tasks
          </a>

          <a href="#tasks" className="nav-link">
            <span>✓</span> Completed
          </a>

        </nav>

        <div className="sidebar-bottom">
          <p>Stay focused.</p>
          <small>One task at a time.</small>
        </div>

      </aside>

      {/* Main content */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">

          <div>
            <p className="date-label">YOUR WORKSPACE</p>
            <h1>Dashboard</h1>
          </div>

          <div className="profile">
            <div className="avatar">U</div>
            <span>My Account</span>
          </div>

        </header>

        {/* Welcome section */}
        <section className="welcome-section" id="dashboard">

          <div>
            <h2>Welcome back!</h2>
            <p>Here's an overview of your tasks and progress.</p>
          </div>

        </section>

        {/* Statistics */}
        <section className="statistics">

          <div className="stat-card">
            <div className="stat-icon purple">▦</div>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <p>Active Tasks</p>
            <h2>{activeCount}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Completed Tasks</p>
            <h2>{completedCount}</h2>
          </div>

        </section>

        {/* Task management section */}
        <section className="tasks-section" id="tasks">

          <div className="tasks-header">

            <div>
              <h2>My Tasks</h2>
              <p>Manage and track your daily activities.</p>
            </div>

            <button
              className="add-task-button"
              onClick={() => setShowForm(!showForm)}
            >
              + Add Task
            </button>

          </div>

          {/* New task form */}
          {showForm && (

            <form className="task-form" onSubmit={addTask}>

              <h3>Create a New Task</h3>

              <label htmlFor="task-title">Task Title</label>

              <input
                id="task-title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={event => setTitle(event.target.value)}
                required
              />

              <label htmlFor="task-description">Description</label>

              <textarea
                id="task-description"
                placeholder="Describe your task"
                value={description}
                onChange={event => setDescription(event.target.value)}
                rows="3"
              />

              <label htmlFor="task-priority">Priority</label>

              <select
                id="task-priority"
                value={priority}
                onChange={event => setPriority(event.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <div className="form-actions">

                <button type="submit" className="add-task-button">
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

          )}

          {/* Task filters */}
          <div className="filter-buttons">

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

          {/* Task list */}
          <div className="task-list">

            {filteredTasks.map(task => (

              <div className="task-item" key={task.id}>

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <div className="task-details">

                  <h3 className={task.completed ? 'completed-title' : ''}>
                    {task.title}
                  </h3>

                  <p>{task.description}</p>

                </div>

                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>

                <span
                  className={
                    task.completed
                      ? 'status done'
                      : 'status pending'
                  }
                >
                  {task.completed ? 'Completed' : 'In progress'}
                </span>

                {/* Delete task button */}
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>

              </div>

            ))}

            {filteredTasks.length === 0 && (
              <p className="empty-message">No tasks found.</p>
            )}

          </div>

        </section>

        {/* Footer */}
        <footer className="footer">
          TaskFlow — Organise your work, achieve your goals.
        </footer>

      </main>

    </div>
  )
}

export default App

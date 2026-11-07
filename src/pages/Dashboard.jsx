
import { Link } from 'react-router-dom'

// Format dates without changing the original date.
function formatDate(dateValue) {
  if (!dateValue) return 'No due date'

  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) return 'No due date'

  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Format the creation date.
function formatCreatedDate(dateValue) {
  if (!dateValue) return 'Date unavailable'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
  })
}

function Dashboard({ tasks = [] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayString = today.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    task => task.completed
  ).length

  const activeTasks = totalTasks - completedTasks

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false

    const dueDate = new Date(`${task.dueDate}T00:00:00`)

    return !Number.isNaN(dueDate.getTime()) && dueDate < today
  }).length

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  // Tasks due today or within the next seven days.
  const upcomingTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.completed) return false

      const dueDate = new Date(`${task.dueDate}T00:00:00`)
      const daysUntilDue = Math.round(
        (dueDate - today) / (1000 * 60 * 60 * 24)
      )

      return (
        !Number.isNaN(dueDate.getTime()) &&
        daysUntilDue >= 0 &&
        daysUntilDue <= 7
      )
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)

  // Most recently created tasks.
  const recentTasks = [...tasks]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()

      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <div className="dashboard-content">

      {/* Welcome section */}
      <section className="welcome-section dashboard-welcome">
        <div>
          <p className="welcome-date">{todayString}</p>
          <h1>Welcome back!</h1>
          <p className="welcome-description">
            Here's what's happening with your tasks today.
          </p>
        </div>

        <Link to="/tasks" className="dashboard-action">
          View My Tasks →
        </Link>
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
          <div className="stat-icon blue">○</div>
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

        <div className="stat-card">
          <div className="stat-icon red">!</div>
          <div>
            <p>Overdue Tasks</p>
            <h2>{overdueTasks}</h2>
          </div>
        </div>
      </section>

      {/* Productivity progress */}
      <section className="dashboard-panel progress-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Productivity Overview</h2>
            <p>Track your progress towards completing your tasks.</p>
          </div>

          <strong>{completionRate}%</strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Task completion progress"
        >
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="progress-footer">
          <span>{completedTasks} completed</span>
          <span>{activeTasks} remaining</span>
        </div>
      </section>

      {/* Upcoming and recent tasks */}
      <section className="dashboard-lower-grid">

        <div className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h2>Upcoming Tasks</h2>
              <p>Tasks due within the next seven days.</p>
            </div>

            <Link to="/tasks">View all</Link>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="dashboard-task-list">
              {upcomingTasks.map(task => (
                <div className="dashboard-task-item" key={task.id}>
                  <div className="dashboard-task-details">
                    <strong>{task.title}</strong>
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>

                  <span className="dashboard-task-status upcoming">
                    Upcoming
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <span>✓</span>
              <p>No upcoming tasks.</p>
              <small>You're all caught up!</small>
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h2>Recent Tasks</h2>
              <p>Your latest five tasks.</p>
            </div>

            <Link to="/tasks">View all</Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="dashboard-task-list">
              {recentTasks.map(task => (
                <div className="dashboard-task-item" key={task.id}>
                  <div className="dashboard-task-details">
                    <strong>{task.title}</strong>
                    <span>
                      Created {formatCreatedDate(task.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`dashboard-task-status ${
                      task.completed ? 'completed' : 'active'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <span>▦</span>
              <p>No tasks yet.</p>
              <small>Create your first task to get started.</small>
              <Link to="/tasks">Go to My Tasks →</Link>
            </div>
          )}
        </div>

      </section>
    </div>
  )
}

export default Dashboard

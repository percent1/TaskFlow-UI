import { useState } from 'react'

function formatDate(dateValue) {
  if (!dateValue) return 'Not set'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return 'Not available'

  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatCreatedDate(dateValue) {
  if (!dateValue) return 'Not available'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return 'Not available'

  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Tasks({
  tasks,
  loading,
  error,
  filter,
  setFilter,
  setError,
  setShowForm,
  toggleTask,
  deleteTask,
}) {
  const [selectedTask, setSelectedTask] = useState(null)

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Active') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  })

  // Keep the selected task details updated after status changes.
  const currentSelectedTask = selectedTask
    ? tasks.find(task => task.id === selectedTask.id) || null
    : null

  return (
    <>
      <section className="tasks-section">
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
                    className={`task-clickable-title ${
                      task.completed ? 'completed-title' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="task-title-button"
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.title}
                    </button>
                  </h3>

                  <p>{task.description}</p>

                  {task.dueDate && (
                    <small>Due: {formatDate(task.dueDate)}</small>
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

      {/* Task details popup */}
      {currentSelectedTask && (
        <div
          className="modal-overlay task-details-overlay"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="task-modal task-details-modal redesigned-task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-details-title"
            onClick={event => event.stopPropagation()}
          >
            <div className="task-details-topbar">
              <span className="task-details-label">
                TASK OVERVIEW
              </span>

              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedTask(null)}
                aria-label="Close task details"
              >
                ✕
              </button>
            </div>

            <div className="task-details-hero">
              <span
                className={`task-details-status ${
                  currentSelectedTask.completed
                    ? 'is-completed'
                    : 'is-active'
                }`}
              >
                <span className="task-status-dot" />
                {currentSelectedTask.completed
                  ? 'Completed'
                  : 'In Progress'}
              </span>

              <h2 id="task-details-title">
                {currentSelectedTask.title}
              </h2>

              <p className="task-details-subtitle">
                {currentSelectedTask.completed
                  ? 'This task has been completed.'
                  : 'Here is an overview of your task.'}
              </p>
            </div>

            <div className="task-details-divider" />

            <div className="task-details-description-section">
              <h3>Description</h3>

              <p>
                {currentSelectedTask.description ||
                  'No description has been added to this task.'}
              </p>
            </div>

            <div className="task-details-date-grid">
              <div className="task-date-card">
                <span className="task-date-icon">📅</span>
                <div>
                  <span className="task-date-label">Due date</span>
                  <strong>
                    {formatDate(currentSelectedTask.dueDate)}
                  </strong>
                </div>
              </div>

              <div className="task-date-card">
                <span className="task-date-icon">🕒</span>
                <div>
                  <span className="task-date-label">Created</span>
                  <strong>
                    {formatCreatedDate(currentSelectedTask.createdAt)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="task-details-footer">
              <button
                type="button"
                className="delete-task-modal-button"
                onClick={() => {
                  deleteTask(currentSelectedTask.id)
                  setSelectedTask(null)
                }}
              >
                🗑 Delete Task
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="primary-button task-completion-button"
                onClick={() => toggleTask(currentSelectedTask.id)}
              >
                {currentSelectedTask.completed
                  ? '↶ Mark as Active'
                  : '✓ Mark as Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Tasks
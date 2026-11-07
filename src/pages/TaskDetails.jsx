
import { useNavigate } from 'react-router-dom'

function TaskDetails({ task, toggleTask }) {
  const navigate = useNavigate()

  if (!task) {
    return (
      <section className="tasks-section">
        <h2>Task not found</h2>
        <p>This task could not be found.</p>

        <button
          className="primary-button"
          onClick={() => navigate('/tasks')}
        >
          Back to My Tasks
        </button>
      </section>
    )
  }

  return (
    <section className="tasks-section">
      <div className="section-heading">
        <div>
          <h2>Task Details</h2>
          <p>View and manage your task.</p>
        </div>

        <button
          className="cancel-button"
          onClick={() => navigate('/tasks')}
        >
          ← Back to My Tasks
        </button>
      </div>

      <div className="task-card task-detail-card">
        <div className="task-details">
          <h2>{task.title}</h2>

          <p>
            {task.description || 'No description provided.'}
          </p>

          <div className="task-detail-info">
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={
                  task.completed
                    ? 'status-completed'
                    : 'status-active'
                }
              >
                {task.completed ? 'Completed' : 'In Progress'}
              </span>
            </p>

            <p>
              <strong>Due Date:</strong>{' '}
              {task.dueDate || 'No due date set'}
            </p>

            <p>
              <strong>Created:</strong>{' '}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleString()
                : 'Not available'}
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => toggleTask(task.id)}
          >
            Mark as {task.completed ? 'Active' : 'Completed'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default TaskDetails

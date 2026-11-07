# TaskFlow – Full-Stack Task Management Application

TaskFlow is a full-stack task management application built to help users organise their daily activities, manage their tasks, and track their progress.

The application features secure user authentication, personal task management, and account settings. It was developed using Java, Spring Boot, React, and MySQL, with the backend and frontend deployed separately.

## Live Application

- **Frontend:** [TaskFlow Live Application](https://taskflow-ten-pi-71.vercel.app/)
- **Backend API:** https://todoapp-production-d00b.up.railway.app
- **Backend Repository:** [TaskFlow Backend – GitHub](https://github.com/percent1/TodoApp)
- **Frontend Repository:** [TaskFlow Frontend – GitHub](https://github.com/percent1/TodoAPPU)

## Features

### User Authentication and Security
- User registration and login.
- JWT-based authentication.
- Secure password hashing using BCrypt.
- Protected API endpoints.
- User-specific data access.

### Task Management
- Create new tasks.
- View all personal tasks.
- View individual task details.
- Update task information.
- Mark tasks as completed or active.
- Delete tasks.
- Filter tasks by status.

### Account Management
- View account information.
- Update account name.
- Change account password.
- Validate password changes.

### User Interface
- Responsive React interface.
- Interactive task management dashboard.
- Task detail pop-up.
- Navigation between application pages.
- Loading indicators and error handling.

## Technology Stack

| Area | Technologies |
|---|---|
| Backend | Java 21, Spring Boot |
| Frontend | React, JavaScript, Vite |
| Database | MySQL |
| Data Access | Spring Data JPA, Hibernate |
| API Communication | REST API, Axios |
| Authentication | Spring Security, JWT |
| Password Security | BCrypt |
| Deployment | Railway, Vercel |
| Version Control | Git, GitHub |

## Application Architecture

TaskFlow uses a client-server architecture.

1. The React frontend provides the user interface.
2. Axios sends HTTP requests to the Spring Boot REST API.
3. Spring Security handles authentication and authorization.
4. JWT tokens are used to authenticate protected requests.
5. Spring Data JPA manages database operations.
6. MySQL stores user accounts and task information.

The frontend and backend communicate through REST API endpoints using JSON.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Register a new user |
| POST | `/auth/login` | Authenticate a user |

### User Account

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Retrieve current user |
| PUT | `/users/me` | Update account name |
| PUT | `/users/me/password` | Change account password |

### Task Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve personal tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks/{id}` | Retrieve a specific task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

Protected endpoints require a valid JWT access token.

## Local Installation and Setup

### Prerequisites

- Java 21 or later
- Node.js and npm
- MySQL
- Git

### 1. Clone the repositories

Frontend:

```bash
git clone https://github.com/percent1/TodoAPPU.git
```

Backend:

```bash
git clone https://github.com/percent1/TodoApp.git
```

### 2. Configure the database

Create a MySQL database:

```sql
CREATE DATABASE taskmanagerdb;
```

Configure your database connection and JWT secret using environment variables. Never commit passwords or secret keys to GitHub.

### 3. Configure the backend

Set the required environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
```

Navigate to the backend project directory and run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 4. Configure the frontend

Navigate to the frontend project directory and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the frontend root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local address displayed by Vite, usually:

```text
http://localhost:5173
```

## Security Considerations

- Passwords are hashed before being stored.
- JWT authentication protects secured endpoints.
- Users can only access their own task records.
- Sensitive configuration is managed through environment variables.
- Backend authorization is enforced independently of the frontend.

## Deployment

TaskFlow is deployed using:

- **Railway:** Spring Boot backend and MySQL database.
- **Vercel:** React frontend.

The frontend communicates with the deployed backend through the configured API base URL.

## Future Improvements

Potential improvements include:

- Automated backend and frontend testing.
- Task priority levels.
- Task categories and labels.
- Due-date notifications.
- Improved dashboard analytics.

## Author

**Percy Ngobeni**

Aspiring Junior Software Developer interested in Java, Spring Boot, backend development, and full-stack application development.

- GitHub: [percent1](https://github.com/percent1)
- LinkedIn: [Percy Ngobeni](https://linkedin.com/in/percy-ngobeni-5176601bb)

---

*TaskFlow was developed as a portfolio project to demonstrate practical full-stack software development skills, REST API development, database integration, authentication, and deployment.*
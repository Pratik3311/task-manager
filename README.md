# 🚀 TaskFlow - Complete Task Management Application

<div align="center">

![TaskFlow](https://img.shields.io/badge/TaskFlow-Task%20Management-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)

*A modern, full-stack task management application with microservices architecture*

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

TaskFlow is a comprehensive task management application built with modern web technologies. It features a clean, minimalistic UI and follows microservices architecture with separate authentication and task management services. Users can create, manage, and export their tasks with full CRUD operations and JWT-based authentication.

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with JWT tokens
- 📝 **Task Management** - Complete CRUD operations for tasks
- ✅ **Task Validation** - Title and due date validation with error handling
- 👤 **User-Specific Data** - Each user sees only their own tasks
- 📊 **Excel Export** - Export tasks to .xlsx format
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Clean UI** - Minimalistic design with Tailwind CSS
- ⚡ **Real-time Updates** - Instant task updates without page refresh
- 🔒 **Secure Communication** - JWT-based authentication between services

## 🏗️ Architecture

TaskFlow uses a **microservices architecture** with three main components:

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │◄──►│   Backend1      │    │   Backend2      │
│   (React.js)    │    │ (Auth Service)  │    │ (Task Service)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Port: 3000    │    │   Port: 3001    │    │   Port: 8000    │
│   React App     │    │   Express.js    │    │    FastAPI      │
│                 │    │   + SQLite      │    │   + SQLite      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🛠 Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.2.0 | UI Library for building user interfaces |
| **TypeScript** | 4.7.4 | Type-safe JavaScript for better development |
| **React Router** | 6.3.0 | Client-side routing and navigation |
| **Tailwind CSS** | 4.1.10 | Utility-first CSS framework for styling |
| **Fetch API** | Native | HTTP client for API communication |

### Backend1 (Authentication Service)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **SQLite3** | 5.1.6 | Lightweight database for user data |
| **bcryptjs** | 2.4.3 | Password hashing and security |
| **jsonwebtoken** | 9.0.0 | JWT token generation and validation |
| **cors** | 2.8.5 | Cross-origin resource sharing |

### Backend2 (Task Management Service)
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.104.1 | Modern Python web framework |
| **Pydantic** | 2.5.0 | Data validation and serialization |
| **SQLite** | Native | Database for task storage |
| **pandas** | 2.1.3 | Data manipulation for Excel export |
| **xlsxwriter** | 3.1.9 | Excel file generation |
| **PyJWT** | 2.8.0 | JWT token validation |
| **uvicorn** | 0.24.0 | ASGI server for FastAPI |

## 📁 Project Structure

\`\`\`
task-management-app/
├── 📁 frontend/                    # React.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/          # React Components
│   │   │   ├── 📄 Login.tsx        # Login form component
│   │   │   ├── 📄 Register.tsx     # Registration form component
│   │   │   ├── 📄 TaskDashboard.tsx # Main dashboard component
│   │   │   ├── 📄 TaskForm.tsx     # Task creation/editing form
│   │   │   └── 📄 TaskList.tsx     # Task list display component
│   │   ├── 📁 contexts/            # React Context Providers
│   │   │   └── 📄 AuthContext.tsx  # Authentication context
│   │   ├── 📄 App.tsx              # Main application component
│   │   ├── 📄 index.tsx            # Application entry point
│   │   └── 📄 index.css            # Tailwind CSS imports
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 tailwind.config.js       # Tailwind configuration
│   └── 📄 postcss.config.js        # PostCSS configuration
│
├── 📁 backend1/                    # Node.js Authentication Service
│   ├── 📄 server.js                # Express server with auth routes
│   ├── 📄 package.json             # Backend1 dependencies
│   └── 📄 auth.db                  # SQLite database (auto-generated)
│
├── 📁 backend2/                    # FastAPI Task Management Service
│   ├── 📄 main.py                  # FastAPI application with task routes
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 test_export.py           # Export functionality test script
│   └── 📄 tasks.db                 # SQLite database (auto-generated)
│
├── 📁 scripts/                     # Database Initialization Scripts
│   ├── 📄 init_auth_db.sql         # Authentication database schema
│   └── 📄 init_tasks_db.sql        # Tasks database schema
│
└── 📄 README.md                    # Project documentation
\`\`\`

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://python.org/)
- **npm** or **yarn** - Package manager

### Environment Configuration

Create \`.env\` files in both backend directories:

#### Backend1 (.env)
\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
\`\`\`

#### Backend2 (.env)
\`\`\`env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
\`\`\`

> ⚠️ **Important**: Use the same \`JWT_SECRET\` for both backends to ensure proper authentication.

### Step-by-Step Setup

#### 1️⃣ Backend1 Setup (Authentication Service)

\`\`\`bash
# Navigate to backend1 directory
cd backend1

# Install Node.js dependencies
npm install

# Start the authentication server
npm start
\`\`\`

✅ **Authentication service running on:** http://localhost:3001

#### 2️⃣ Backend2 Setup (Task Management Service)

\`\`\`bash
# Navigate to backend2 directory
cd backend2

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the task management server
python main.py
\`\`\`

✅ **Task management service running on:** http://localhost:8000

#### 3️⃣ Frontend Setup (React Application)

\`\`\`bash
# Navigate to frontend directory
cd frontend

# Install React dependencies
npm install

# Install Tailwind CSS (if not already installed)
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Initialize Tailwind (if needed)
npx tailwindcss init -p

# Start the React development server
npm start
\`\`\`

✅ **Frontend application running on:** http://localhost:3000

## 📚 API Documentation

### 🔐 Authentication Service (Backend1) - Port 3001

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | \`/api/auth/register\` | Register new user | \`{username, email, password}\` | \`{message, userId}\` |
| POST | \`/api/auth/login\` | User login | \`{email, password}\` | \`{token, user}\` |
| GET | \`/api/auth/me\` | Get current user | Headers: \`Authorization: Bearer <token>\` | \`{user}\` |

### 📝 Task Management Service (Backend2) - Port 8000

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | \`/tasks/\` | Get all user tasks | Headers: \`Authorization: Bearer <token>\` | \`[{task1}, {task2}, ...]\` |
| POST | \`/tasks/\` | Create new task | \`{title, description, effort, due_date}\` | \`{task}\` |
| GET | \`/tasks/{task_id}\` | Get specific task | Headers: \`Authorization: Bearer <token>\` | \`{task}\` |
| PUT | \`/tasks/{task_id}\` | Update task | \`{title?, description?, effort?, due_date?, completed?}\` | \`{task}\` |
| DELETE | \`/tasks/{task_id}\` | Delete task | Headers: \`Authorization: Bearer <token>\` | \`{message}\` |
| GET | \`/tasks/export/\` | Export tasks to Excel | Headers: \`Authorization: Bearer <token>\` | Excel file download |

## 🗄️ Database Schema

### Users Table (Authentication Database)
\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,           -- bcrypt hashed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tasks Table (Task Management Database)
\`\`\`sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,         -- Links to users.id
    title TEXT NOT NULL,
    description TEXT,
    effort INTEGER NOT NULL,          -- Days required
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🔒 Authentication Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant T as Task Service

    U->>F: Register/Login
    F->>A: POST /api/auth/login
    A->>A: Validate credentials
    A->>F: Return JWT token
    F->>F: Store token in localStorage
    
    U->>F: Create/View tasks
    F->>T: API request with JWT
    T->>T: Validate JWT token
    T->>F: Return user-specific data
    F->>U: Display tasks
\`\`\`

## 📖 Usage

### 1. User Registration & Login
1. Open http://localhost:3000
2. Click "Create Account" to register
3. Fill in username, email, and password
4. Login with your credentials

### 2. Task Management
1. **Create Task**: Click "Add Task" and fill in details
2. **View Tasks**: All your tasks are displayed in the dashboard
3. **Edit Task**: Click "Edit" on any task to modify
4. **Delete Task**: Click "Delete" to remove a task
5. **Export Tasks**: Click "Export" to download Excel file

### 3. Task Validation
- **Title**: Required field
- **Due Date**: Cannot be in the past
- **Effort**: Must be at least 1 day

## 🚀 Deployment

### Production Deployment Steps

#### 1. Frontend Deployment (Vercel/Netlify)
\`\`\`bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting service
\`\`\`

#### 2. Backend1 Deployment (Heroku/Railway)
\`\`\`bash
# Set environment variables in your hosting platform
JWT_SECRET=your-production-secret
PORT=3001
\`\`\`

#### 3. Backend2 Deployment (Heroku/Railway)
\`\`\`bash
# Set environment variables in your hosting platform
JWT_SECRET=your-production-secret
\`\`\`

#### 4. Update API URLs
Update frontend API URLs to point to your deployed backend services.

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **CORS Errors** | Ensure backend CORS settings include your frontend URL |
| **JWT Errors** | Verify JWT_SECRET is identical in both backends |
| **Database Errors** | Check if SQLite databases are created properly |
| **Port Conflicts** | Ensure ports 3000, 3001, 8000 are available |
| **Tailwind Not Working** | Run \`npx tailwindcss init -p\` and check CSS imports |

### Debug Commands
\`\`\`bash
# Check if services are running
curl http://localhost:3001/api/auth/me
curl http://localhost:8000/

# View logs
# Backend1: Check terminal output
# Backend2: Check terminal output
# Frontend: Check browser console (F12)
\`\`\`

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (\`git checkout -b feature/amazing-feature\`)
3. **Commit** your changes (\`git commit -m 'Add amazing feature'\`)
4. **Push** to the branch (\`git push origin feature/amazing-feature\`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**[Your Name]**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ using React.js, Node.js, FastAPI, and SQLite

</div>

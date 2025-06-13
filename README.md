# TaskFlow - Task Management Application

A complete task management application with user authentication, task CRUD operations, and Excel export functionality.

## Demo Video Link : https://drive.google.com/file/d/17P9bZNUuqyP92buBqiCJoIYc8dlZNJax/view?usp=sharing

<p align="center">
  <img src="https://github.com/user-attachments/assets/58c205ff-1144-4ab8-a2b6-ccf5edd6d256" width="45%" />
  <img src="https://github.com/user-attachments/assets/b4249c3c-a5c7-4bfb-91ee-6968c518b927" width="45%" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/68b256f2-3b97-4dc3-80fd-a216dec937c6" width="45%" />
  <img src="https://github.com/user-attachments/assets/7ee96fe4-2c3a-499c-9506-f462d809e7ce" width="45%" />
</p>


## Overview

TaskFlow is a full-stack application built with:
- Frontend: React.js with TypeScript
- Backend1: Node.js/Express for authentication
- Backend2: FastAPI/Python for task management
- Database: SQLite for data storage

## Features

- User registration and login
- JWT-based authentication
- Create, view, update, and delete tasks
- Task validation (title, due date)
- Export tasks to Excel
- Responsive design

## Project Structure

\`\`\`
task-management-app/
├── frontend/               # React.js frontend
├── backend1/               # Node.js authentication service
├── backend2/               # FastAPI task management service
└── scripts/                # Database initialization scripts
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Step 1: Set up Backend1 (Authentication Service)

1. Navigate to the backend1 directory:
\`\`\`bash
cd backend1
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file with the following content:
\`\`\`
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
\`\`\`

4. Start the server:
\`\`\`bash
npm start
\`\`\`

The authentication service will run on http://localhost:3001

### Step 2: Set up Backend2 (Task Management Service)

1. Navigate to the backend2 directory:
\`\`\`bash
cd backend2
\`\`\`

2. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

3. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Create a `.env` file with the following content:
\`\`\`
JWT_SECRET=your-secret-key-change-in-production
\`\`\`
Note: Use the same JWT_SECRET as in Backend1.

5. Start the server:
\`\`\`bash
python main.py
\`\`\`

The task management service will run on http://localhost:8000

### Step 3: Set up Frontend

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Install Tailwind CSS:
\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

4. Start the development server:
\`\`\`bash
npm start
\`\`\`

The frontend will run on http://localhost:5173 or it will show in the terminal

## Usage Instructions

### 1. Registration and Login

1. Open http://localhost:5173 in your browser
2. Click "Create account" to register a new user
3. Fill in the registration form with username, email, and password
4. After registration, you'll be redirected to the login page
5. Enter your email and password to log in

### 2. Task Management

#### Creating Tasks
1. After logging in, you'll see the dashboard
2. Click "Add Task" or "Create Task" button
3. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Effort in days (required)
   - Due date (required, must be in the future)
4. Click "Create Task" to save

#### Managing Tasks
1. All your tasks are displayed in the task list
2. Each task shows:
   - Title and description
   - Effort (in days)
   - Due date
   - Status (overdue, completed)
3. Click "Edit" to modify a task
4. Click "Delete" to remove a task

#### Exporting Tasks
1. Click the "Export" button in the header
2. An Excel file containing all your tasks will be downloaded

### 3. Logging Out

Click the "Logout" button in the header to log out of the application

## API Documentation

### Authentication Service (Backend1)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/me` - Get current user info (protected)

### Task Management Service (Backend2)
- `GET /tasks/` - Get all tasks for authenticated user
- `POST /tasks/` - Create a new task
- `GET /tasks/{task_id}` - Get specific task
- `PUT /tasks/{task_id}` - Update task
- `DELETE /tasks/{task_id}` - Delete task
- `GET /tasks/export/` - Export tasks to Excel

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend services have proper CORS configuration
2. **Database Errors**: Check if SQLite databases are created properly
3. **JWT Errors**: Ensure JWT_SECRET is the same in both backends
4. **Port Conflicts**: Make sure ports 3000, 3001, and 8000 are available
5. **Tailwind CSS not working**: Make sure you've initialized Tailwind properly and imported the CSS in your index file

### Logs

- Backend1 logs: Check console output
- Backend2 logs: Check console output
- Frontend logs: Check browser console (F12)
  

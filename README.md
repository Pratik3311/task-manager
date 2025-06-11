# Task Management Application

A complete full-stack task management application with separate authentication and task management services.

## Architecture

- **Frontend**: React.js with TypeScript
- **Backend1**: Node.js/Express (Authentication Service)
- **Backend2**: FastAPI/Python (Task Management Service)
- **Database**: SQLite (separate databases for auth and tasks)

## Features

### Frontend
- User registration and login
- JWT-based authentication
- Task creation with validation
- Task listing and management
- Task editing and deletion
- Excel export functionality
- Responsive design

### Backend1 (Authentication)
- User registration with password hashing
- User login with JWT token generation
- Password validation
- SQLite database for user storage

### Backend2 (Task Management)
- CRUD operations for tasks
- JWT token validation
- Task validation (title, due date)
- User-specific task filtering
- Excel export endpoint
- SQLite database for task storage

## Project Structure

\`\`\`
task-management-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── backend1/
│   ├── server.js
│   └── package.json
├── backend2/
│   ├── main.py
│   └── requirements.txt
├── scripts/
│   ├── init_auth_db.sql
│   └── init_tasks_db.sql
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend1 Setup (Authentication Service)

1. Navigate to the backend1 directory:
\`\`\`bash
cd backend1
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the server:
\`\`\`bash
npm start
\`\`\`

The authentication service will run on http://localhost:3001

### Backend2 Setup (Task Management Service)

1. Navigate to the backend2 directory:
\`\`\`bash
cd backend2
\`\`\`

2. Create a virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\`\`\`

3. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Start the server:
\`\`\`bash
python main.py
\`\`\`

The task management service will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication Service (Backend1)
- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Login user and get JWT token
- \`GET /api/auth/me\` - Get current user info (protected)

### Task Management Service (Backend2)
- \`GET /tasks/\` - Get all tasks for authenticated user
- \`POST /tasks/\` - Create a new task
- \`GET /tasks/{task_id}\` - Get specific task
- \`PUT /tasks/{task_id}\` - Update task
- \`DELETE /tasks/{task_id}\` - Delete task
- \`GET /tasks/export\` - Export tasks to Excel

## Authentication Flow

1. User registers/logs in through Frontend
2. Frontend sends credentials to Backend1
3. Backend1 validates and returns JWT token
4. Frontend stores token and includes it in requests to Backend2
5. Backend2 validates JWT token for protected routes

## Database Schema

### Users Table (Backend1)
\`\`\`sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tasks Table (Backend2)
\`\`\`sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    effort INTEGER NOT NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Environment Variables

Create \`.env\` files in both backend directories:

### Backend1 (.env)
\`\`\`
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
\`\`\`

### Backend2 (.env)
\`\`\`
JWT_SECRET=your-super-secret-jwt-key-change-in-production
\`\`\`

## Development

### Running in Development Mode

1. Start Backend1:
\`\`\`bash
cd backend1
npm run dev
\`\`\`

2. Start Backend2:
\`\`\`bash
cd backend2
python main.py
\`\`\`

3. Start Frontend:
\`\`\`bash
cd frontend
npm start
\`\`\`

### Testing the Application

1. Open http://localhost:3000
2. Register a new account
3. Login with your credentials
4. Create, edit, and manage tasks
5. Export tasks to Excel

## Security Considerations

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Add input sanitization
- Use environment variables for sensitive data
- Implement proper error handling
- Add logging for security events

## Deployment

### Production Deployment

1. Build the frontend:
\`\`\`bash
cd frontend
npm run build
\`\`\`

2. Deploy each service separately:
   - Frontend: Deploy build folder to static hosting (Vercel, Netlify)
   - Backend1: Deploy to Node.js hosting (Heroku, Railway)
   - Backend2: Deploy to Python hosting (Heroku, Railway)

3. Update CORS settings and API URLs for production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend services have proper CORS configuration
2. **Database Errors**: Check if SQLite databases are created properly
3. **JWT Errors**: Ensure JWT_SECRET is the same in both backends
4. **Port Conflicts**: Make sure ports 3000, 3001, and 8000 are available

### Logs

- Backend1 logs: Check console output
- Backend2 logs: Check console output or use \`uvicorn --log-level debug\`
- Frontend logs: Check browser console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

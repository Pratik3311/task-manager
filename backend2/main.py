from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, validator
from typing import List, Optional
import sqlite3
import jwt
import os
from datetime import datetime, date
import pandas as pd
from io import BytesIO
import traceback

app = FastAPI(title="Task Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")

# Database setup
DB_PATH = "tasks.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            effort INTEGER NOT NULL,
            due_date DATE NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Pydantic models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    effort: int
    due_date: date

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()

    @validator('effort')
    def effort_must_be_positive(cls, v):
        if v < 1:
            raise ValueError('Effort must be at least 1 day')
        return v

    @validator('due_date')
    def due_date_must_be_future(cls, v):
        if v < date.today():
            raise ValueError('Due date cannot be in the past')
        return v

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    effort: Optional[int] = None
    due_date: Optional[date] = None
    completed: Optional[bool] = None

    @validator('title')
    def title_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip() if v else v

    @validator('effort')
    def effort_must_be_positive(cls, v):
        if v is not None and v < 1:
            raise ValueError('Effort must be at least 1 day')
        return v

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    effort: int
    due_date: date
    completed: bool
    created_at: datetime

# Authentication dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("userId")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# Database helper functions
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Routes
@app.get("/")
def read_root():
    return {"message": "Task Management API"}

@app.post("/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, user_id: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO tasks (user_id, title, description, effort, due_date)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, task.title, task.description, task.effort, task.due_date))
    
    task_id = cursor.lastrowid
    conn.commit()
    
    # Fetch the created task
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    
    return dict(row)

@app.get("/tasks/", response_model=List[TaskResponse])
def get_tasks(user_id: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, user_id: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return dict(row)

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, user_id: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if task exists and belongs to user
    cursor.execute("SELECT * FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    existing_task = cursor.fetchone()
    
    if not existing_task:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Build update query dynamically
    update_fields = []
    update_values = []
    
    for field, value in task_update.dict(exclude_unset=True).items():
        if value is not None:
            update_fields.append(f"{field} = ?")
            update_values.append(value)
    
    if update_fields:
        update_values.append(task_id)
        update_values.append(user_id)
        
        query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ? AND user_id = ?"
        cursor.execute(query, update_values)
        conn.commit()
    
    # Fetch updated task
    cursor.execute("SELECT * FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    row = cursor.fetchone()
    conn.close()
    
    return dict(row)

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user_id: int = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    
    conn.commit()
    conn.close()
    
    return {"message": "Task deleted successfully"}

# Export tasks endpoint
@app.get("/tasks/export/")
async def export_tasks_endpoint(user_id: int = Depends(get_current_user)):
    print(f"Export request for user_id: {user_id}")
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch user's tasks with explicit query
        cursor.execute("""
            SELECT title, description, effort, due_date, completed, created_at
            FROM tasks 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        """, (user_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        print(f"Found {len(rows)} tasks for user {user_id}")
        
        # Convert to list of dictionaries
        tasks_data = []
        for row in rows:
            tasks_data.append({
                'Title': row[0],
                'Description': row[1] or '',
                'Effort (Days)': row[2],
                'Due Date': row[3],
                'Completed': 'Yes' if row[4] else 'No',
                'Created At': row[5]
            })
        
        # If no tasks, create empty structure
        if not tasks_data:
            tasks_data = [{
                'Title': '',
                'Description': '',
                'Effort (Days)': '',
                'Due Date': '',
                'Completed': '',
                'Created At': ''
            }]
        
        # Create DataFrame
        df = pd.DataFrame(tasks_data)
        
        # Create Excel file in memory
        excel_buffer = BytesIO()
        
        # Use xlsxwriter engine for better compatibility
        with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='My Tasks')
            
            # Get the workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['My Tasks']
            
            # Set column widths
            worksheet.set_column('A:A', 20)  # Title
            worksheet.set_column('B:B', 30)  # Description
            worksheet.set_column('C:C', 15)  # Effort
            worksheet.set_column('D:D', 15)  # Due Date
            worksheet.set_column('E:E', 12)  # Completed
            worksheet.set_column('F:F', 20)  # Created At
        
        excel_buffer.seek(0)
        
        print("Excel file created successfully")
        
        # Return the file as a streaming response
        return StreamingResponse(
            BytesIO(excel_buffer.getvalue()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=my_tasks.xlsx"}
        )
        
    except Exception as e:
        print(f"Error in export_tasks: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error generating Excel file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

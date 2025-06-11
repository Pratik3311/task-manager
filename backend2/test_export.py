import sqlite3
import pandas as pd
from io import BytesIO

# Test the export functionality
def test_export():
    try:
        # Connect to database
        conn = sqlite3.connect("tasks.db")
        cursor = conn.cursor()
        
        # Check if tasks table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            print("Tasks table doesn't exist!")
            return
        
        # Get all tasks
        cursor.execute("SELECT * FROM tasks")
        all_tasks = cursor.fetchall()
        print(f"Total tasks in database: {len(all_tasks)}")
        
        # Test export for user_id = 1 (or any existing user)
        cursor.execute("""
            SELECT title, description, effort, due_date, completed, created_at
            FROM tasks 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        """, (1,))
        
        rows = cursor.fetchall()
        print(f"Tasks for user 1: {len(rows)}")
        
        if rows:
            for row in rows:
                print(f"Task: {row}")
        
        # Test pandas DataFrame creation
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
        
        df = pd.DataFrame(tasks_data)
        print("DataFrame created successfully:")
        print(df)
        
        # Test Excel creation
        excel_buffer = BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='My Tasks')
        
        print("Excel file created successfully!")
        print(f"Excel file size: {len(excel_buffer.getvalue())} bytes")
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_export()

"use client"

import type React from "react"
import type { Task } from "./TaskDashboard"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No tasks yet</p>
        <p className="text-sm text-gray-400">Create your first task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const overdue = !task.completed && isOverdue(task.due_date)

        return (
          <div
            key={task.id}
            className={`p-4 border rounded-lg ${
              overdue
                ? "border-red-200 bg-red-50"
                : task.completed
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium ${
                    task.completed ? "text-green-700 line-through" : overdue ? "text-red-700" : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && <p className="mt-1 text-sm text-gray-600">{task.description}</p>}

                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    {task.effort} day{task.effort !== 1 ? "s" : ""}
                  </span>
                  <span>Due: {formatDate(task.due_date)}</span>

                  {overdue && !task.completed && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Overdue</span>
                  )}

                  {task.completed && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Completed</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(task)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => task.id && onDelete(task.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TaskList

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"

export interface Task {
  id?: number
  title: string
  description: string
  effort: number
  due_date: string
  completed?: boolean
  created_at?: string
}

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const { token, logout, user } = useAuth()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else if (response.status === 401) {
        logout()
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskSubmit = async (taskData: Task) => {
    try {
      const url = editingTask ? `http://localhost:8000/tasks/${editingTask.id}` : "http://localhost:8000/tasks/"
      const method = editingTask ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        fetchTasks()
        setEditingTask(null)
        setShowTaskForm(false)
      }
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchTasks()
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  const handleExportTasks = async () => {
    try {
      setExporting(true)
      const response = await fetch("http://localhost:8000/tasks/export/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `tasks_${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Export failed:", response.status, response.statusText)
        alert("Failed to export tasks. Please try again.")
      }
    } catch (error) {
      console.error("Error exporting tasks:", error)
      alert("Error exporting tasks. Please check your connection.")
    } finally {
      setExporting(false)
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.filter((task) => !task.completed).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.username}</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportTasks}
                disabled={exporting}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exporting ? "Exporting..." : "Export"}
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
            <div className="text-2xl font-semibold text-gray-900 ">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
            <div className="text-2xl font-semibold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
            <div className="text-2xl font-semibold text-blue-600">{pendingTasks}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1 ">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">{editingTask ? "Edit Task" : "New Task"}</h2>
                  {!showTaskForm && !editingTask && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Add Task
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {showTaskForm || editingTask ? (
                  <TaskForm
                    task={editingTask}
                    onSubmit={handleTaskSubmit}
                    onCancel={() => {
                      setEditingTask(null)
                      setShowTaskForm(false)
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Ready to add a new task?</p>
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2 shadow-lg">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {tasks.length === 0 ? "No tasks yet" : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="p-6">
                <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDashboard

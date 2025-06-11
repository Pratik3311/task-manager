"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Task } from "./TaskDashboard"

interface TaskFormProps {
  task: Task | null
  onSubmit: (task: Task) => void
  onCancel: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    effort: 1,
    due_date: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        effort: 1,
        due_date: "",
      })
    }
  }, [task])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.due_date) {
      newErrors.due_date = "Due date is required"
    } else {
      const dueDate = new Date(formData.due_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        newErrors.due_date = "Due date cannot be in the past"
      }
    }

    if (formData.effort < 1) {
      newErrors.effort = "Effort must be at least 1 day"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "effort" ? Number.parseInt(value) || 0 : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter task title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Add description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Effort (days) *</label>
          <input
            type="number"
            name="effort"
            value={formData.effort}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.effort ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.effort && <p className="mt-1 text-sm text-red-600">{errors.effort}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.due_date ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {task ? "Update Task" : "Create Task"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskForm

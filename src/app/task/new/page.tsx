"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createTask } from '@/lib/api/task'
import { emptyTask, Task } from '@/interfaces/task'
import { styles } from '../../style'
import { taskStyles } from '../taskStyle'

export default function NewTaskPage() {
  const router = useRouter()
  const [task, setTask] = useState<Omit<Task, 'id'>>(emptyTask)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTitleClick = () => setEditingTitle(true)
  const handleDescriptionClick = () => setEditingDescription(true)

  const handleTitleChange = (value: string) => {
    setTask(prev => ({ ...prev, title: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setTask(prev => ({ ...prev, description: value }))
  }

  const handleTitleSubmit = () => {
    setEditingTitle(false)
  }

  const handleDescriptionSubmit = () => {
    setEditingDescription(false)
  }

  const handleStatusToggle = () => {
    setTask(prev => ({ ...prev, completed: !prev.completed }))
  }

  const handleSubmit = async () => {
    if (!task.title.trim()) {
      setError('Task title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const newTask = await createTask(task)
      router.push(`/task/${newTask.id}`)
    } catch (err) {
      setError('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className="max-w-4xl mx-auto py-12">
        <Link href="/" className={taskStyles.backLink}>
          ← Back to Home
        </Link>

        <div className="space-y-12">
          {/* Title Section */}
          <div className="text-center">
            {editingTitle ? (
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyPress={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="text-5xl font-bold bg-transparent border-b-2 border-red-500 text-gray-100 text-center focus:outline-none focus:border-red-400 w-full"
                autoFocus
                placeholder="Enter task title..."
              />
            ) : (
              <h1
                className={`${taskStyles.taskTitle} text-5xl cursor-pointer hover:text-red-400 transition-colors`}
                onClick={handleTitleClick}
              >
                {task.title || 'Click to add title'}
              </h1>
            )}
          </div>

          {/* Description Section */}
          <div className="max-w-2xl mx-auto">
            {editingDescription ? (
              <textarea
                value={task.description || ''}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={handleDescriptionSubmit}
                className="w-full bg-gray-800 border-2 border-red-500 rounded-lg p-4 text-gray-100 text-lg leading-relaxed focus:outline-none focus:border-red-400 resize-none"
                rows={6}
                placeholder="Enter task description..."
                autoFocus
              />
            ) : (
              <div
                className={`${taskStyles.taskDescription} cursor-pointer hover:text-red-400 transition-colors min-h-40 flex items-center justify-center text-center border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-red-500`}
                onClick={handleDescriptionClick}
              >
                {task.description || 'Click to add description'}
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4">
              <span className="text-gray-400 text-lg">Status:</span>
              <button
                onClick={handleStatusToggle}
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-all ${
                  task.completed
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white'
                }`}
              >
                {task.completed ? '✓ Completed' : '⏳ Pending'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-center">
              <div className={styles.error}>{error}</div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${styles.createButton} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{loading ? 'Creating Task...' : 'Create Task'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
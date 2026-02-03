"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createTask } from '@/lib/api/task'
import { Prisma } from '@prisma/client'
import { globalStyles } from '../../style'
import { taskStyles } from '../taskStyle'
import { emptyTask } from '@/interfaces/task'

export default function NewTaskPage() {
  const router = useRouter()
  const [task, setTask] = useState<Prisma.TaskCreateInput>(emptyTask)
  const [recurrence, setRecurrence] = useState<Prisma.RecurrenceRuleCreateWithoutTaskInput | null>(null)
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

  const handleStatusToggle = () => {
    setTask(prev => ({ ...prev, completed: !prev.completed }))
  }

  const handleStartAtChange = (value: string) => {
    setTask(prev => ({ ...prev, startAt: new Date(value) }))
  }

  const handleRecurringToggle = () => {
    setTask(prev => ({ ...prev, recurring: !prev.recurring }))
    if (!task.recurring) {
      setRecurrence({
        frequency: 'daily',
        interval: 1,
        weekdays: undefined,
        endsAt: undefined,
      })
    } else {
      setRecurrence(null)
    }
  }

  const handleRecurrenceChange = (field: string, value: any) => {
    setRecurrence(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleSubmit = async () => {
    if (!task.title.trim()) {
      setError('Task title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const taskData = { ...task }
      if (task.recurring && recurrence) {
        taskData.recurrence = { create: recurrence }
      }
      const newTask = await createTask(taskData)
      router.push(`/task/${newTask.id}`)
    } catch (err) {
      setError('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={globalStyles.container}>
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
                onBlur={() => setEditingTitle(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
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
                onBlur={() => setEditingDescription(false)}
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

          {/* Start At Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4">
              <span className="text-gray-400 text-lg">Start At:</span>
              <input
                type="datetime-local"
                value={task.startAt ? new Date(task.startAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleStartAtChange(e.target.value)}
                className="bg-gray-800 border-2 border-red-500 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          {/* Recurring Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4">
              <span className="text-gray-400 text-lg">Recurring:</span>
              <button
                onClick={handleRecurringToggle}
                className={`px-6 py-3 rounded-lg font-medium text-lg transition-all ${
                  task.recurring
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white'
                }`}
              >
                {task.recurring ? '✓ Yes' : '✗ No'}
              </button>
            </div>
          </div>

          {/* Recurrence Details */}
          {task.recurring && recurrence && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center">
                <span className="text-gray-400 text-lg">Frequency:</span>
                <select
                  value={recurrence.frequency}
                  onChange={(e) => handleRecurrenceChange('frequency', e.target.value)}
                  className="ml-4 bg-gray-800 border-2 border-red-500 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-red-400"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-lg">Interval:</span>
                <input
                  type="number"
                  min="1"
                  value={recurrence.interval}
                  onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                  className="ml-4 bg-gray-800 border-2 border-red-500 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-red-400 w-20"
                />
              </div>
              {recurrence.frequency === 'weekly' && (
                <div className="text-center">
                  <span className="text-gray-400 text-lg">Weekdays:</span>
                  <input
                    type="text"
                    placeholder="e.g., [1,3,5]"
                    value={recurrence.weekdays ? JSON.stringify(recurrence.weekdays) : ''}
                    onChange={(e) => {
                      try {
                        const val = e.target.value ? JSON.parse(e.target.value) : undefined
                        handleRecurrenceChange('weekdays', val)
                      } catch {
                        // invalid JSON, ignore
                      }
                    }}
                    className="ml-4 bg-gray-800 border-2 border-red-500 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-red-400"
                  />
                </div>
              )}
              <div className="text-center">
                <span className="text-gray-400 text-lg">Ends At:</span>
                <input
                  type="datetime-local"
                  value={recurrence.endsAt ? new Date(recurrence.endsAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleRecurrenceChange('endsAt', e.target.value ? new Date(e.target.value) : null)}
                  className="ml-4 bg-gray-800 border-2 border-red-500 rounded-lg p-2 text-gray-100 focus:outline-none focus:border-red-400"
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="text-center">
              <div className={globalStyles.error}>{error}</div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${globalStyles.createButton} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className={globalStyles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
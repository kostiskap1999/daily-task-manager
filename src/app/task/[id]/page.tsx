"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getTask } from '@/lib/api/task'
import { Task } from '@/interfaces/task'
import { styles } from '../../style'

export default function TaskDetail() {
  const params = useParams()
  const id = params?.id ? parseInt(params.id as string) : null

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  console.log('params:', params)
  console.log('id:', id)
  if (!id || isNaN(id))
    return

  const fetchTask = async () => {
    try {
      setLoading(true)
      const fetchedTask = await getTask(id)
      console.log(fetchedTask)
      setTask(fetchedTask)
    } catch (err) {
      setError('Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  fetchTask()
}, [id])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading task...</div>
      </div>
    )
  }

  if (!id || isNaN(id)) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Invalid task ID</div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Task not found'}</div>
        <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className={`${styles.taskCard} border-l-4 ${task.completed ? 'border-green-500' : 'border-orange-500'}`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>

          {task.description && (
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{task.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span className={`text-lg font-medium ${task.completed ? styles.taskCompleted : styles.taskPending}`}>
              {task.completed ? '✓ Completed' : '⏳ Pending'}
            </span>

            <div className="text-sm text-gray-500">
              Task ID: {task.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
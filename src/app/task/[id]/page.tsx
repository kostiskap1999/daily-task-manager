"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getTask } from '@/lib/api/task'
import { globalStyles } from '../../style'
import { taskStyles } from '../taskStyle'
import { Task } from '@prisma/client'
import PageWrapper from '@/app/components/PageWrapper'

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

  if (!id || isNaN(id)) {
    return (
      <div className={globalStyles.container}>
        <div className={globalStyles.error}>Invalid task ID</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className={globalStyles.container}>
        <div className={globalStyles.error}>{'Task not found'}</div>
        <Link href="/" className={taskStyles.backLink}>
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <PageWrapper loading={loading} error={error} className={globalStyles.container}>
      <div className={taskStyles.contentWrapper}>
        <Link href="/" className={taskStyles.backLink}>
          ← Back to Home
        </Link>

        <div className={`${globalStyles.taskCard} ${taskStyles.taskCard} ${task.completed ? taskStyles.taskCardCompleted : taskStyles.taskCardPending}`}>
          <h1 className={taskStyles.taskTitle}>{task.title}</h1>

          {task.description && (
            <p className={taskStyles.taskDescription}>{task.description}</p>
          )}

          <div className={taskStyles.taskMeta}>
            <span className={`text-lg font-medium ${task.completed ? globalStyles.taskCompleted : globalStyles.taskPending}`}>
              {task.completed ? '✓ Completed' : '⏳ Pending'}
            </span>

            <div className={taskStyles.taskId}>
              Task ID: {task.id}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
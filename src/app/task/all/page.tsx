"use client"

import { useState, useEffect } from 'react'
import { getTasks } from '@/lib/api/task'
import { Task } from '@prisma/client'
import { globalStyles } from '@/app/style'
import TaskButton from '@/app/components/TaskButton'
import PageWrapper from '@/app/components/PageWrapper'

interface TasksByDay {
  [key: string]: Task[]
}

export default function AllTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
      } catch (err) {
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const groupTasksByDay = () => {
    const grouped: TasksByDay = {}

    tasks.forEach(task => {
      const taskDate = new Date(task.startAt)
      const dateKey = taskDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(task)
    })

    // Sort by date
    return Object.entries(grouped).sort((a, b) => {
      const dateA = new Date(a[1][0].startAt)
      const dateB = new Date(b[1][0].startAt)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const groupedTasks = groupTasksByDay()

  return (
    <PageWrapper loading={loading} error={error} className={globalStyles.container}>
      <h1 className="text-4xl font-bold mb-8">All Tasks</h1>

      {groupedTasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="space-y-8">
          {groupedTasks.map(([dateKey, dayTasks]) => (
            <div key={dateKey}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                {dateKey}
              </h2>
              <div className="space-y-3">
                {dayTasks.map(task => (
                  <TaskButton key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

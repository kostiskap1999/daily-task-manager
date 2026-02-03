"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTasks } from '@/lib/api/task'
import { Task } from '@prisma/client'

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

  if (loading) {
    return (
      <div className="pt-20 pl-8 pr-8">
        <div className="text-center text-gray-500">Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 pl-8 pr-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  const groupedTasks = groupTasksByDay()

  return (
    <div className="pt-20 pl-8 pr-8 pb-8">
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
                  <Link key={task.id} href={`/task/${task.id}`}>
                    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                      )}
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
                          task.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTasks } from '@/lib/api/task'
import { globalStyles } from './style'
import { Task } from '@prisma/client'
import TaskButton from './components/TaskButton'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

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

  const handleDayChange = (modifier: number) => {
    const msInDay = 24 * 60 * 60 * 1000
    setSelectedDate(prev => new Date(prev.getTime() + modifier * msInDay))
  }

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.startAt)
    return taskDate.toDateString() === selectedDate.toDateString()
  })


  if (loading) {
    return (
      <div className={globalStyles.container}>
        <div className={globalStyles.loading}>Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={globalStyles.container}>
        <div className={globalStyles.error}>{error}</div>
      </div>
    )
  }

  return (
    <div className={globalStyles.container}>
      <h1 className={globalStyles.header}>Daily Task Manager</h1>
      
      {/* Date */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <button onClick={() => handleDayChange(-1)} className={globalStyles.arrow}>←</button>
        <span className={globalStyles.date}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <button onClick={() => handleDayChange(1)} className={globalStyles.arrow}>→</button>
      </div>

      {/* Task List */}
      <div className={globalStyles.taskList}>
        {filteredTasks.map(task => (
          <TaskButton key={task.id} task={task} />
        ))}
      </div>

      {/* Create New */}
      <Link href="/task/new">
        <button className={globalStyles.createButton}>
          <svg className={globalStyles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Task</span>
        </button>
      </Link>
    </div>
  )
}

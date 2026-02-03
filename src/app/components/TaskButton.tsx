"use client"

import Link from 'next/link'
import { Task } from '@prisma/client'
import { globalStyles } from '../style'


export default function TaskButton({ task }: { task: Task }) {

  return (
    <Link key={task.id} href={`/task/${task.id}`}>
      <div className={`${globalStyles.taskCard} cursor-pointer hover:scale-105 transition-transform`}>
          <h2 className={globalStyles.taskTitle}>{task.title}</h2>
          {task.description && (
          <p className={globalStyles.taskDescription}>{task.description}</p>
          )}
          <span className={task.completed ? globalStyles.taskCompleted : globalStyles.taskPending}>
          {task.completed ? 'Completed' : 'Pending'}
          </span>
      </div>
    </Link>
  )
}

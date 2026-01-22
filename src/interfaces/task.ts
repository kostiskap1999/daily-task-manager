export interface Task {
  id: number
  title: string
  description?: string | null
  completed: boolean
}

export const emptyTask: Task = {
    id: 0,
    title: '',
    description: null,
    completed: false
}

export const defaultTask = {
    title: 'New Task',
    description: 'Task description',
    completed: false,
}
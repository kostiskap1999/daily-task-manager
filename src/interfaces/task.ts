export interface Task {
  id: number
  title: string
  description?: string | null
  completed: boolean
}

export const defaultTask: Task = {
    id: 0,
    title: '',
    description: null,
    completed: false
}
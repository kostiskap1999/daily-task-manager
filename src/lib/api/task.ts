import { Task } from "@/interfaces/task";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch('/api/task')
  if (!response.ok)
    throw new Error('Failed to fetch tasks')
  return response.json();
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const response = await fetch('/api/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  if (!response.ok)
    throw new Error('Failed to create task')
  return response.json();
}

import { Prisma } from '@prisma/client'

export const emptyTask: Prisma.TaskCreateInput = {
    title: '',
    description: null,
    completed: false,
    startAt: new Date(),
    recurring: false,
}

export const defaultTask: Prisma.TaskCreateInput = {
    title: 'New Task',
    description: 'Task description',
    completed: false,
    startAt: new Date(),
    recurring: false,
}
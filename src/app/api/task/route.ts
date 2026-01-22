import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'

// get all tasks
export async function GET() {
  const tasks = await prisma.task.findMany({})
  return Response.json(tasks)
}


// post a new task
export async function POST(req: NextRequest) {
  const data: Prisma.TaskCreateInput = await req.json()

  const newTask = await prisma.task.create({ data })

  return Response.json(newTask)
}
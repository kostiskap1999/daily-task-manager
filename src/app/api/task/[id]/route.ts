import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// get one task
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await prisma.task.findUnique({ where: { id: parseInt(id) } })

  if (task)
    return Response.json(task)
  else
    return Response.json({ error: 'Task not found' }, { status: 404 })
  
}
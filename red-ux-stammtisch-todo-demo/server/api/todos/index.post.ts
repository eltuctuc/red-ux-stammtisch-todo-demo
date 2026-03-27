import { z } from 'zod'
import { useDb } from '../../db'
import { todos, subtasks } from '../../db/schema'

const bodySchema = z.object({
  title: z.string().min(1, 'Titel darf nicht leer sein'),
  complexity: z.enum(['XS', 'S', 'M', 'L', 'XL']).optional(),
  deadline: z.string().date().nullable().optional(),
  subtasks: z.array(z.string().min(1)).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const rows = await db
    .insert(todos)
    .values({
      title: body.title,
      complexity: body.complexity ?? 'M',
      deadline: body.deadline ?? null,
    })
    .returning()

  const todo = rows[0]
  if (!todo) throw createError({ statusCode: 500, statusMessage: 'Todo konnte nicht erstellt werden' })

  const subtaskRows = body.subtasks?.length
    ? await db
        .insert(subtasks)
        .values(body.subtasks.map((title) => ({ todoId: todo.id, title })))
        .returning()
    : []

  return { ...todo, subtasks: subtaskRows }
})

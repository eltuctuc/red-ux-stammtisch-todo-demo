import { z } from 'zod'
import { eq, isNull, and } from 'drizzle-orm'
import { useDb } from '../../db'
import { todos, subtasks } from '../../db/schema'

const idSchema = z.string().uuid()

const bodySchema = z.object({
  title: z.string().min(1).optional(),
  complexity: z.enum(['XS', 'S', 'M', 'L', 'XL']).optional(),
  deadline: z.string().date().nullable().optional(),
  subtasks: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1),
      }),
    )
    .optional(),
})

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  if (!idSchema.safeParse(rawId).success) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Todo-ID' })
  }
  const id = rawId!

  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (body.title !== undefined) updates.title = body.title
  if (body.complexity !== undefined) updates.complexity = body.complexity
  if (body.deadline !== undefined) updates.deadline = body.deadline

  const [todo] = await db
    .update(todos)
    .set(updates)
    .where(and(eq(todos.id, id), isNull(todos.deletedAt)))
    .returning()

  if (!todo) throw createError({ statusCode: 404, statusMessage: 'Todo nicht gefunden' })

  let subtaskRows = await db
    .select()
    .from(subtasks)
    .where(eq(subtasks.todoId, id))

  if (body.subtasks !== undefined) {
    const incoming = body.subtasks
    const incomingIds = incoming.filter((s) => s.id).map((s) => s.id!)
    const toDelete = subtaskRows
      .filter((s) => !incomingIds.includes(s.id))
      .map((s) => s.id)

    for (const subtaskId of toDelete) {
      await db.delete(subtasks).where(eq(subtasks.id, subtaskId))
    }

    for (const s of incoming) {
      if (s.id) {
        await db
          .update(subtasks)
          .set({ title: s.title })
          .where(eq(subtasks.id, s.id))
      } else {
        await db.insert(subtasks).values({ todoId: id, title: s.title })
      }
    }

    subtaskRows = await db.select().from(subtasks).where(eq(subtasks.todoId, id))
  }

  return { ...todo, subtasks: subtaskRows }
})

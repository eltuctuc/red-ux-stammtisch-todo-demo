import { z } from 'zod'
import { eq, isNull, and } from 'drizzle-orm'
import { useDb } from '../../db'
import { todos } from '../../db/schema'

const idSchema = z.string().uuid()

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  if (!idSchema.safeParse(rawId).success) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Todo-ID' })
  }
  const id = rawId!
  const db = useDb()

  const [todo] = await db
    .update(todos)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(todos.id, id), isNull(todos.deletedAt)))
    .returning()

  if (!todo) throw createError({ statusCode: 404, statusMessage: 'Todo nicht gefunden oder bereits gelöscht' })

  return { ok: true }
})

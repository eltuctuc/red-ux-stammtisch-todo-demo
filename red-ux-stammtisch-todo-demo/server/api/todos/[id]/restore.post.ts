import { z } from 'zod'
import { eq, isNotNull, and, gt } from 'drizzle-orm'
import { useDb } from '../../../db'
import { todos } from '../../../db/schema'

const idSchema = z.string().uuid()

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  if (!idSchema.safeParse(rawId).success) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Todo-ID' })
  }
  const id = rawId!
  const db = useDb()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [todo] = await db
    .update(todos)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(
      and(
        eq(todos.id, id),
        isNotNull(todos.deletedAt),
        gt(todos.deletedAt!, sevenDaysAgo),
      ),
    )
    .returning()

  if (!todo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo nicht gefunden, nicht im Papierkorb oder Frist abgelaufen',
    })
  }

  return { ok: true, todo }
})

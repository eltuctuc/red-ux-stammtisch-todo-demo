import { eq } from 'drizzle-orm'
import { useDb } from '../../db'
import { todos } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const db = useDb()

  const [todo] = await db
    .update(todos)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(todos.id, id))
    .returning()

  if (!todo) throw createError({ statusCode: 404, statusMessage: 'Todo nicht gefunden' })

  return { ok: true }
})

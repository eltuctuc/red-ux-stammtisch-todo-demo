import { lt, isNotNull } from 'drizzle-orm'
import { useDb } from '../../db'
import { todos } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Protect against unauthorized calls (Vercel Cron sends this header)
  const cronSecret = getHeader(event, 'x-cron-secret')
  if (cronSecret !== config.cronSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const db = useDb()

  const deleted = await db
    .delete(todos)
    .where(lt(todos.deletedAt!, sevenDaysAgo))
    .returning({ id: todos.id })

  return { deleted: deleted.length }
})

import { useDb } from '../../db'
import { todos, subtasks } from '../../db/schema'
import { isNull, isNotNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const isBin = query.bin === 'true'
  const db = useDb()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const todoRows = await db
    .select()
    .from(todos)
    .where(
      isBin
        ? isNotNull(todos.deletedAt)
        : isNull(todos.deletedAt),
    )
    .orderBy(todos.createdAt)

  // Filter bin entries older than 7 days (already purged by cron, but guard)
  const filtered = isBin
    ? todoRows.filter((t) => t.deletedAt! > sevenDaysAgo)
    : todoRows

  const subtaskRows = await db.select().from(subtasks)

  return filtered.map((todo) => ({
    ...todo,
    subtasks: subtaskRows.filter((s) => s.todoId === todo.id),
  }))
})

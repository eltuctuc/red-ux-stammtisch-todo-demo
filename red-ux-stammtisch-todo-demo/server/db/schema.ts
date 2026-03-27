import { pgTable, pgEnum, uuid, text, date, timestamp } from 'drizzle-orm/pg-core'

export const complexityEnum = pgEnum('complexity', ['XS', 'S', 'M', 'L', 'XL'])

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  complexity: complexityEnum('complexity').notNull().default('M'),
  deadline: date('deadline'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const subtasks = pgTable('subtasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  todoId: uuid('todo_id')
    .notNull()
    .references(() => todos.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert
export type Subtask = typeof subtasks.$inferSelect
export type NewSubtask = typeof subtasks.$inferInsert

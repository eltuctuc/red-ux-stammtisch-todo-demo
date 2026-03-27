import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

export interface Subtask {
  id: string
  todoId: string
  title: string
  createdAt: string
}

export interface Todo {
  id: string
  title: string
  complexity: 'XS' | 'S' | 'M' | 'L' | 'XL'
  deadline: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  subtasks: Subtask[]
}

export interface CreateTodoPayload {
  title: string
  complexity?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  deadline?: string | null
  subtasks?: string[]
}

export interface UpdateTodoPayload {
  title?: string
  complexity?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  deadline?: string | null
  subtasks?: { id?: string; title: string }[]
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const trashTodos = ref<Todo[]>([])
  const isTrashView = ref(false)
  const isLoading = ref(false)

  const activeTodos = computed(() => todos.value)
  const currentList = computed(() => (isTrashView.value ? trashTodos.value : todos.value))

  async function fetchTodos() {
    isLoading.value = true
    try {
      const [active, trash] = await Promise.all([
        $fetch<Todo[]>('/api/todos'),
        $fetch<Todo[]>('/api/todos?bin=true'),
      ])
      todos.value = active
      trashTodos.value = trash
    } catch {
      toast.error('Todos konnten nicht geladen werden')
    } finally {
      isLoading.value = false
    }
  }

  async function createTodo(payload: CreateTodoPayload) {
    const optimisticId = crypto.randomUUID()
    const optimistic: Todo = {
      id: optimisticId,
      title: payload.title,
      complexity: payload.complexity ?? 'M',
      deadline: payload.deadline ?? null,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: (payload.subtasks ?? []).map((title) => ({
        id: crypto.randomUUID(),
        todoId: optimisticId,
        title,
        createdAt: new Date().toISOString(),
      })),
    }

    todos.value.unshift(optimistic)

    try {
      const created = await $fetch<Todo>('/api/todos', {
        method: 'POST',
        body: payload,
      })
      const idx = todos.value.findIndex((t) => t.id === optimisticId)
      if (idx !== -1) todos.value[idx] = created
      toast.success('Todo erstellt')
    } catch {
      todos.value = todos.value.filter((t) => t.id !== optimisticId)
      toast.error('Fehler beim Erstellen', {
        action: { label: 'Erneut versuchen', onClick: () => createTodo(payload) },
      })
    }
  }

  async function updateTodo(id: string, payload: UpdateTodoPayload) {
    const original = todos.value.find((t) => t.id === id)
    if (!original) return

    const optimistic: Todo = {
      ...original,
      ...payload,
      subtasks: payload.subtasks
        ? payload.subtasks.map((s) => ({
            id: s.id ?? crypto.randomUUID(),
            todoId: id,
            title: s.title,
            createdAt: new Date().toISOString(),
          }))
        : original.subtasks,
      updatedAt: new Date().toISOString(),
    }

    const idx = todos.value.findIndex((t) => t.id === id)
    if (idx !== -1) todos.value[idx] = optimistic

    try {
      const updated = await $fetch<Todo>(`/api/todos/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      if (idx !== -1) todos.value[idx] = updated
      toast.success('Todo gespeichert')
    } catch {
      if (idx !== -1) todos.value[idx] = original
      toast.error('Fehler beim Speichern', {
        action: { label: 'Erneut versuchen', onClick: () => updateTodo(id, payload) },
      })
    }
  }

  async function deleteTodo(id: string) {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return

    todos.value = todos.value.filter((t) => t.id !== id)

    // Optimistically move to trash
    const trashed: Todo = { ...todo, deletedAt: new Date().toISOString() }
    trashTodos.value.unshift(trashed)

    let undone = false

    toast('Todo gelöscht', {
      duration: 3000,
      action: {
        label: 'Rückgängig',
        onClick: () => {
          undone = true
          todos.value.unshift(todo)
          trashTodos.value = trashTodos.value.filter((t) => t.id !== id)
        },
      },
      onDismiss: async () => {
        if (undone) return
        try {
          await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
        } catch {
          todos.value.unshift(todo)
          trashTodos.value = trashTodos.value.filter((t) => t.id !== id)
          toast.error('Fehler beim Löschen')
        }
      },
    })
  }

  async function restoreTodo(id: string) {
    const todo = trashTodos.value.find((t) => t.id === id)
    if (!todo) return

    trashTodos.value = trashTodos.value.filter((t) => t.id !== id)
    const restored: Todo = { ...todo, deletedAt: null }
    todos.value.unshift(restored)

    try {
      await $fetch(`/api/todos/${id}/restore`, { method: 'POST' })
      toast.success('Todo wiederhergestellt')
    } catch {
      todos.value = todos.value.filter((t) => t.id !== id)
      trashTodos.value.unshift(todo)
      toast.error('Fehler beim Wiederherstellen')
    }
  }

  return {
    todos,
    trashTodos,
    isTrashView,
    isLoading,
    activeTodos,
    currentList,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    restoreTodo,
  }
})

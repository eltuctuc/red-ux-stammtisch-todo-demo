<template>
  <div class="page">
    <StickyHeader
      :is-trash-view="store.isTrashView"
      @update:is-trash-view="store.isTrashView = $event"
    />

    <main class="list-container">
      <div v-if="store.isLoading" class="loading" aria-live="polite">
        Laden…
      </div>

      <template v-else>
        <TransitionGroup name="list" tag="div" class="todo-list">
          <template v-if="store.isTrashView">
            <div
              v-for="todo in store.trashTodos"
              :key="todo.id"
              class="trash-item"
            >
              <TodoCard :todo="todo" @click="() => {}" />
              <button
                type="button"
                class="restore-btn"
                @click="store.restoreTodo(todo.id)"
              >
                Wiederherstellen
              </button>
            </div>
          </template>

          <TodoCard
            v-for="todo in store.todos"
            v-else
            :key="todo.id"
            :todo="todo"
            @click="openEdit(todo)"
          />
        </TransitionGroup>

        <EmptyState
          v-if="store.currentList.length === 0"
          :is-trash="store.isTrashView"
        />
      </template>
    </main>

    <FAB v-if="!store.isTrashView" @click="showNew = true" />

    <NewTodoSheet v-model="showNew" />
    <EditTodoSheet v-model="showEdit" :todo="selectedTodo" />
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/stores/todos'
import { useTodosStore } from '~/stores/todos'

const store = useTodosStore()
const showNew = ref(false)
const showEdit = ref(false)
const selectedTodo = ref<Todo | null>(null)

function openEdit(todo: Todo) {
  selectedTodo.value = todo
  showEdit.value = true
}

onMounted(() => {
  store.fetchTodos()
})
</script>

<style scoped>
.page {
  min-height: 100dvh;
  background: #f9fafb;
}

.list-container {
  padding: 12px 16px 96px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 0.9rem;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trash-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.restore-btn {
  padding: 8px 14px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  align-self: flex-start;
  min-height: 36px;
}

.restore-btn:hover {
  background: #e5e7eb;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

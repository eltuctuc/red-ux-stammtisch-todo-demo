<template>
  <component
    :is="readonly ? 'div' : 'button'"
    v-bind="readonly ? {} : { type: 'button' }"
    class="card"
    :class="{ overdue: isOverdue, readonly }"
    :aria-label="readonly ? undefined : `Todo: ${todo.title}`"
    @click="readonly ? undefined : emit('click')"
  >
    <div class="card-main">
      <span class="card-title">{{ todo.title }}</span>
      <span v-if="todo.subtasks.length" class="card-subtask-count">
        {{ todo.subtasks.length }} Teilaufgabe{{ todo.subtasks.length > 1 ? 'n' : '' }}
      </span>
    </div>

    <div class="card-meta">
      <span v-if="todo.deadline" class="meta-chip" :class="{ 'chip-overdue': isOverdue }">
        {{ formatDate(todo.deadline) }}
      </span>
      <span class="meta-chip">{{ todo.complexity }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { Todo } from '~/stores/todos'

const props = defineProps<{ todo: Todo; readonly?: boolean }>()
const emit = defineEmits<{ click: [] }>()

const isOverdue = computed(() => {
  if (!props.todo.deadline) return false
  return new Date(props.todo.deadline) < new Date(new Date().toDateString())
})

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date(dateStr))
}
</script>

<style scoped>
.card {
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card:active {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
  border-color: var(--color-primary, #f97316);
}

.card.overdue {
  border-color: #fca5a5;
  background: #fff5f5;
}

.card.readonly {
  cursor: default;
}

.card.readonly:active {
  box-shadow: none;
  border-color: #e5e7eb;
}

.card-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
}

.card-subtask-count {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
}

.card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.meta-chip {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 20px;
  background: #f3f4f6;
  color: #6b7280;
}

.chip-overdue {
  background: #fee2e2;
  color: #dc2626;
}
</style>

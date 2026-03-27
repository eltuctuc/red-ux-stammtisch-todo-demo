<template>
  <BottomSheet
    :model-value="modelValue"
    variant="full"
    @update:model-value="$emit('update:modelValue', $event)"
    @request-close="handleRequestClose"
  >
    <template v-if="todo">
      <form class="sheet-form" @submit.prevent="handleSave">
        <div class="sheet-top-actions">
          <button
            type="button"
            class="delete-btn"
            aria-label="Todo löschen"
            @click="handleDelete"
          >
            🗑
          </button>
        </div>

        <div class="form-field">
          <input
            ref="titleInput"
            v-model="title"
            type="text"
            class="title-input"
            :class="{ error: titleError }"
            placeholder="Titel"
            aria-label="Titel"
            :aria-describedby="titleError ? 'edit-title-error' : undefined"
            @input="titleError = false"
          />
          <span
            v-if="titleError"
            id="edit-title-error"
            class="field-error"
            aria-live="polite"
          >
            Bitte einen Titel eingeben.
          </span>
        </div>

        <div class="form-row">
          <label class="field-label">Deadline</label>
          <input
            v-model="deadline"
            type="date"
            class="date-input"
            :class="{ 'date-past': isDeadlinePast }"
            aria-label="Deadline"
          />
          <span v-if="isDeadlinePast" class="hint-warn">Deadline liegt in der Vergangenheit</span>
        </div>

        <div class="form-row">
          <label class="field-label">Komplexität</label>
          <KomplexitaetSelector v-model="complexity" />
        </div>

        <div class="form-row">
          <label class="field-label">Unteraufgaben</label>
          <SubtaskList v-model="subtaskItems" />
        </div>

        <button
          type="submit"
          class="save-btn"
          :disabled="!title.trim()"
          aria-label="Änderungen speichern"
        >
          Speichern
        </button>
      </form>
    </template>
  </BottomSheet>

  <UnsavedChangesDialog
    v-model="showDiscardDialog"
    @confirm="forceClose"
    @cancel="showDiscardDialog = false"
  />
</template>

<script setup lang="ts">
import type { Todo } from '~/stores/todos'
import { useTodosStore } from '~/stores/todos'

const props = defineProps<{
  modelValue: boolean
  todo: Todo | null
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const store = useTodosStore()
const titleInput = ref<HTMLInputElement | null>(null)

const title = ref('')
const complexity = ref<'XS' | 'S' | 'M' | 'L' | 'XL'>('M')
const deadline = ref('')
const subtaskItems = ref<{ key: string; id?: string; title: string }[]>([])
const titleError = ref(false)
const showDiscardDialog = ref(false)

const isDeadlinePast = computed(() => {
  if (!deadline.value) return false
  return new Date(deadline.value) < new Date(new Date().toDateString())
})

const hasChanges = computed(() => {
  if (!props.todo) return false
  return (
    title.value !== props.todo.title ||
    complexity.value !== props.todo.complexity ||
    deadline.value !== (props.todo.deadline ?? '') ||
    JSON.stringify(subtaskItems.value.map((s) => ({ id: s.id, title: s.title }))) !==
      JSON.stringify(props.todo.subtasks.map((s) => ({ id: s.id, title: s.title })))
  )
})

watch(
  () => props.todo,
  (todo) => {
    if (todo) {
      title.value = todo.title
      complexity.value = todo.complexity
      deadline.value = todo.deadline ?? ''
      subtaskItems.value = todo.subtasks.map((s) => ({
        key: s.id,
        id: s.id,
        title: s.title,
      }))
      titleError.value = false
      nextTick(() => titleInput.value?.focus())
    }
  },
  { immediate: true },
)

function handleRequestClose() {
  if (hasChanges.value) {
    showDiscardDialog.value = true
  } else {
    forceClose()
  }
}

function forceClose() {
  showDiscardDialog.value = false
  emit('update:modelValue', false)
}

async function handleSave() {
  if (!title.value.trim()) {
    titleError.value = true
    titleInput.value?.focus()
    return
  }

  await store.updateTodo(props.todo!.id, {
    title: title.value.trim(),
    complexity: complexity.value,
    deadline: deadline.value || null,
    subtasks: subtaskItems.value.map((s) => ({
      id: s.id,
      title: s.title.trim(),
    })).filter((s) => s.title),
  })

  emit('update:modelValue', false)
}

async function handleDelete() {
  emit('update:modelValue', false)
  await store.deleteTodo(props.todo!.id)
}
</script>

<style scoped>
.sheet-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 16px 24px;
}

.sheet-top-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #dc2626;
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #fee2e2;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.title-input {
  font-size: 1.05rem;
  padding: 12px 0;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  outline: none;
  background: transparent;
  color: #111827;
  min-height: 44px;
  transition: border-color 0.15s ease;
}

.title-input:focus {
  border-bottom-color: var(--color-primary, #f97316);
}

.title-input.error {
  border-bottom-color: #dc2626;
}

.field-error {
  font-size: 0.8rem;
  color: #dc2626;
}

.date-input {
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
  background: #fff;
  min-height: 44px;
  outline: none;
}

.date-input:focus {
  border-color: var(--color-primary, #f97316);
}

.date-past {
  border-color: #fca5a5 !important;
}

.hint-warn {
  font-size: 0.78rem;
  color: #b45309;
}

.save-btn {
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: var(--color-primary, #f97316);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 52px;
  transition: opacity 0.15s ease;
}

.save-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>

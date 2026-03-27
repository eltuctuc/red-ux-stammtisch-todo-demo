<template>
  <BottomSheet
    :model-value="modelValue"
    variant="half"
    @update:model-value="$emit('update:modelValue', $event)"
    @request-close="handleRequestClose"
  >
    <form class="sheet-form" @submit.prevent="handleSave">
      <div class="form-field">
        <input
          ref="titleInput"
          v-model="title"
          type="text"
          class="title-input"
          :class="{ error: titleError }"
          placeholder="Was muss erledigt werden?"
          aria-label="Titel"
          :aria-describedby="titleError ? 'title-error' : undefined"
          @input="titleError = false"
        />
        <span
          v-if="titleError"
          id="title-error"
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
        <span v-if="isDeadlinePast" class="hint-warn" aria-live="polite">Deadline liegt in der Vergangenheit</span>
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
        aria-label="Todo speichern"
      >
        Speichern
      </button>
    </form>
  </BottomSheet>

  <UnsavedChangesDialog
    v-model="showDiscardDialog"
    @confirm="forceClose"
    @cancel="showDiscardDialog = false"
  />
</template>

<script setup lang="ts">
import { useTodosStore } from '~/stores/todos'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const store = useTodosStore()
const titleInput = ref<HTMLInputElement | null>(null)

const title = ref('')
const complexity = ref<'XS' | 'S' | 'M' | 'L' | 'XL'>('M')
const deadline = ref('')
const subtaskItems = ref<{ key: string; id?: string; title: string }[]>([])
const titleError = ref(false)
const showDiscardDialog = ref(false)

const hasChanges = computed(
  () =>
    title.value.trim() !== '' ||
    deadline.value !== '' ||
    complexity.value !== 'M' ||
    subtaskItems.value.length > 0,
)

const isDeadlinePast = computed(() => {
  if (!deadline.value) return false
  return new Date(deadline.value) < new Date(new Date().toDateString())
})

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm()
      nextTick(() => titleInput.value?.focus())
    }
  },
)

function resetForm() {
  title.value = ''
  complexity.value = 'M'
  deadline.value = ''
  subtaskItems.value = []
  titleError.value = false
}

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

  const success = await store.createTodo({
    title: title.value.trim(),
    complexity: complexity.value,
    deadline: deadline.value || null,
    subtasks: subtaskItems.value
      .map((s) => s.title.trim())
      .filter(Boolean),
  })

  if (success) emit('update:modelValue', false)
}
</script>

<style scoped>
.sheet-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 16px 24px;
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

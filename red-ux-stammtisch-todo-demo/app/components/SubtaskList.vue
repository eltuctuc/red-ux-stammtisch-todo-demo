<template>
  <div class="subtask-list">
    <div
      v-for="(subtask, idx) in items"
      :key="subtask.key"
      class="subtask-row"
    >
      <input
        type="text"
        class="subtask-input"
        :value="subtask.title"
        placeholder="Unteraufgabe…"
        :aria-label="`Unteraufgabe ${idx + 1}`"
        @input="updateItem(idx, ($event.target as HTMLInputElement).value)"
        @keydown.enter.prevent="addItem"
      />
      <button
        type="button"
        class="subtask-remove"
        :aria-label="`Unteraufgabe ${idx + 1} entfernen`"
        @click="removeItem(idx)"
      >
        ✕
      </button>
    </div>

    <button type="button" class="add-btn" @click="addItem">
      + Unteraufgabe hinzufügen
    </button>
  </div>
</template>

<script setup lang="ts">
interface SubtaskItem {
  key: string
  id?: string
  title: string
}

const props = defineProps<{
  modelValue: SubtaskItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [items: SubtaskItem[]]
}>()

const items = computed(() => props.modelValue)

function addItem() {
  emit('update:modelValue', [
    ...props.modelValue,
    { key: crypto.randomUUID(), title: '' },
  ])
}

function updateItem(idx: number, title: string) {
  const updated = props.modelValue.map((s, i) =>
    i === idx ? { ...s, title } : s,
  )
  emit('update:modelValue', updated)
}

function removeItem(idx: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== idx))
}
</script>

<style scoped>
.subtask-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtask-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtask-input {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fff;
  outline: none;
  min-height: 44px;
}

.subtask-input:focus {
  border-color: var(--color-primary, #f97316);
}

.subtask-remove {
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  color: #9ca3af;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.subtask-remove:hover {
  background: #fee2e2;
  color: #dc2626;
}

.add-btn {
  padding: 10px 0;
  border: none;
  background: none;
  color: var(--color-primary, #f97316);
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
  min-height: 44px;
}
</style>

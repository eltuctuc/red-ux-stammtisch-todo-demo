<template>
  <div
    class="selector"
    role="radiogroup"
    :aria-label="label ?? 'Komplexität'"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === option.value"
      :class="['option', { active: modelValue === option.value }]"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
type Complexity = 'XS' | 'S' | 'M' | 'L' | 'XL'

defineProps<{
  modelValue: Complexity
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Complexity]
}>()

const options: { value: Complexity; label: string }[] = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
]
</script>

<style scoped>
.selector {
  display: flex;
  gap: 6px;
}

.option {
  flex: 1;
  padding: 8px 4px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 44px;
}

.option.active {
  border-color: var(--color-primary, #f97316);
  background: #fff7ed;
  color: var(--color-primary, #f97316);
}
</style>

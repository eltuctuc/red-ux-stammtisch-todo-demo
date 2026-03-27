<template>
  <header class="header">
    <h1 class="title">PrioTodo</h1>
    <div class="filter-toggle" role="group" aria-label="Ansicht wechseln">
      <button
        type="button"
        :class="['toggle-btn', { active: !isTrashView }]"
        :aria-pressed="!isTrashView"
        @click="emit('update:isTrashView', false)"
      >
        Aktiv
      </button>
      <button
        type="button"
        :class="['toggle-btn', { active: isTrashView }]"
        :aria-pressed="isTrashView"
        @click="emit('update:isTrashView', true)"
      >
        Papierkorb
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ isTrashView: boolean }>()
const emit = defineEmits<{ 'update:isTrashView': [value: boolean] }>()
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.filter-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.toggle-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 0.8rem;
  color: #6b7280;
  cursor: pointer;
  min-height: 32px;
  transition: all 0.15s ease;
}

.toggle-btn.active {
  background: #fff;
  color: #111827;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>

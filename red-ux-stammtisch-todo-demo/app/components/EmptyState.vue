<template>
  <div class="empty">
    <p class="empty-text">{{ message }}</p>
    <p v-if="!isTrash" class="empty-hint">Tap + um loszulegen ↓</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isTrash?: boolean }>()

const message = computed(() =>
  props.isTrash ? 'Papierkorb ist leer.' : 'Noch keine Todos.',
)
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 8px;
  text-align: center;
}

.empty-text {
  font-size: 1rem;
  color: #9ca3af;
}

.empty-hint {
  font-size: 0.875rem;
  color: #d1d5db;
}
</style>

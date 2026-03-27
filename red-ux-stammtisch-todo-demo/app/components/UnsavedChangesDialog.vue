<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="modelValue" class="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div class="dialog-panel">
          <h2 id="dialog-title" class="dialog-title">Änderungen verwerfen?</h2>
          <p class="dialog-body">Deine Änderungen gehen verloren.</p>
          <div class="dialog-actions">
            <button type="button" class="btn btn-ghost" @click="emit('cancel')">
              Weiter bearbeiten
            </button>
            <button type="button" class="btn btn-danger" @click="emit('confirm')">
              Verwerfen
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.dialog-panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dialog-body {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.btn {
  padding: 12px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  min-height: 44px;
}

.btn-ghost {
  background: #f3f4f6;
  color: #374151;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>

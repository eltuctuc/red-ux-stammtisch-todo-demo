<template>
  <button
    type="button"
    class="fab"
    aria-label="Neues Todo erstellen"
    @click="emit('click')"
  >
    <span class="fab-icon" aria-hidden="true">+</span>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{ click: [] }>()
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary, #f97316);
  border: none;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  z-index: 50;
}

.fab:active {
  transform: scale(0.94);
  box-shadow: 0 2px 6px rgba(249, 115, 22, 0.4);
}

.fab-icon {
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 300;
  margin-top: -2px;
}
</style>

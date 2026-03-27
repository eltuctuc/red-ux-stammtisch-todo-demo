<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="dialog-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        @click.self="emit('cancel')"
      >
        <div ref="panel" class="dialog-panel" tabindex="-1">
          <h2 id="dialog-title" class="dialog-title">{{ title ?? 'Änderungen verwerfen?' }}</h2>
          <p class="dialog-body">{{ body ?? 'Deine Änderungen gehen verloren.' }}</p>
          <div class="dialog-actions">
            <button ref="cancelBtn" type="button" class="btn btn-ghost" @click="emit('cancel')">
              Abbrechen
            </button>
            <button type="button" class="btn btn-danger" @click="emit('confirm')">
              {{ confirmLabel ?? 'Verwerfen' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
  body?: string
  confirmLabel?: string
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()

const panel = ref<HTMLElement | null>(null)
const cancelBtn = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('cancel')
    return
  }
  if (e.key !== 'Tab') return

  const focusable = Array.from(
    panel.value?.querySelectorAll(FOCUSABLE_SELECTORS) ?? [],
  ) as HTMLElement[]
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === first || document.activeElement === panel.value) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

// modelValue is always true when this component renders (v-if on parent)
onMounted(async () => {
  previouslyFocused = document.activeElement as HTMLElement
  document.addEventListener('keydown', handleKeydown)
  await nextTick()
  cancelBtn.value?.focus()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  previouslyFocused?.focus()
  previouslyFocused = null
})
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
  outline: none;
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

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="modelValue"
        class="sheet-backdrop"
        @click.self="handleBackdropClick"
      >
        <div
          ref="panel"
          class="sheet-panel"
          :class="variant === 'full' ? 'sheet-full' : 'sheet-half'"
          :style="dragStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel"
          tabindex="-1"
          @touchstart.passive="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="sheet-handle-bar" />
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    variant?: 'half' | 'full'
    ariaLabel?: string
  }>(),
  { variant: 'half', ariaLabel: 'Dialog' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'request-close': []
}>()

const panel = ref<HTMLElement | null>(null)
const touchStartY = ref(0)
const dragY = ref(0)
const isDragging = ref(false)
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const dragStyle = computed(() =>
  isDragging.value && dragY.value > 0
    ? { transform: `translateY(${dragY.value}px)`, transition: 'none' }
    : {},
)

// ── Focus Trap ──────────────────────────────────────────────────────────────

function getFocusableElements(): HTMLElement[] {
  return Array.from(panel.value?.querySelectorAll(FOCUSABLE_SELECTORS) ?? []) as HTMLElement[]
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('request-close')
    return
  }

  if (e.key !== 'Tab') return
  const focusable = getFocusableElements()
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

watch(
  () => props.modelValue,
  async (open) => {
    document.body.style.overflow = open ? 'hidden' : ''

    if (open) {
      previouslyFocused = document.activeElement as HTMLElement
      document.addEventListener('keydown', handleKeydown)
      await nextTick()
      const focusable = getFocusableElements()
      if (focusable.length) focusable[0].focus()
      else panel.value?.focus()
    } else {
      document.removeEventListener('keydown', handleKeydown)
      previouslyFocused?.focus()
      previouslyFocused = null
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})

// ── Swipe to close ───────────────────────────────────────────────────────────

function onTouchStart(e: TouchEvent) {
  if (!e.touches[0]) return
  // Only activate swipe-close when panel is scrolled to top
  if (panel.value && panel.value.scrollTop > 0) return
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
  dragY.value = 0
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  if (!e.touches[0]) return
  const delta = e.touches[0].clientY - touchStartY.value
  if (delta > 0) {
    dragY.value = delta
    e.preventDefault()
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragY.value > 80) {
    dragY.value = 0
    emit('request-close')
  } else {
    dragY.value = 0
  }
}

function handleBackdropClick() {
  emit('request-close')
}
</script>

<style scoped>
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet-panel {
  width: 100%;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 0 0 env(safe-area-inset-bottom, 16px);
  max-height: 92dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  transition: transform 0.25s ease;
  outline: none;
}

.sheet-half {
  max-height: 60dvh;
}

.sheet-full {
  max-height: 92dvh;
}

.sheet-handle-bar {
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 12px auto 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}

.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>

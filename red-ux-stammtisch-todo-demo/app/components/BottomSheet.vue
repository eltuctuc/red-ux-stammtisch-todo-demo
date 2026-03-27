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
  }>(),
  { variant: 'half' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'request-close': []
}>()

const panel = ref<HTMLElement | null>(null)
const touchStartY = ref(0)
const dragY = ref(0)
const isDragging = ref(false)

const dragStyle = computed(() =>
  isDragging.value && dragY.value > 0
    ? { transform: `translateY(${dragY.value}px)`, transition: 'none' }
    : {},
)

function onTouchStart(e: TouchEvent) {
  if (!e.touches[0]) return
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
  dragY.value = 0
}

function onTouchMove(e: TouchEvent) {
  if (!e.touches[0]) return
  const delta = e.touches[0].clientY - touchStartY.value
  if (delta > 0) {
    dragY.value = delta
    e.preventDefault()
  }
}

function onTouchEnd() {
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

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
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

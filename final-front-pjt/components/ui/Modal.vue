<script setup lang="ts">
/** 접근성을 고려한 모달 — ESC 닫기 · 배경 클릭 닫기 · 스크롤 잠금 · 포커스 이동 */
const open = defineModel<boolean>('open', { default: false })

withDefaults(defineProps<{
  title: string
  description?: string
  width?: number
}>(), {
  width: 520,
})

const panel = ref<HTMLElement | null>(null)
const titleId = useId()

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, async (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    panel.value?.querySelector<HTMLElement>('input, textarea, button:not([data-close])')?.focus()
  }
  else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal"
        @mousedown.self="close"
      >
        <div
          ref="panel"
          class="modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :style="{ maxWidth: `${width}px` }"
        >
          <header class="modal__header">
            <div>
              <h2
                :id="titleId"
                class="modal__title"
              >
                {{ title }}
              </h2>
              <p
                v-if="description"
                class="modal__desc"
              >
                {{ description }}
              </p>
            </div>
            <button
              type="button"
              class="modal__close"
              aria-label="닫기"
              data-close
              @click="close"
            >
              <UiIcon name="x" />
            </button>
          </header>
          <div
            v-if="$slots.default"
            class="modal__body"
          >
            <slot />
          </div>
          <footer
            v-if="$slots.footer"
            class="modal__footer"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgb(0 0 0 / 0.65);
  backdrop-filter: blur(6px);

  &__panel {
    width: 100%;
    max-height: calc(100dvh - 32px);
    overflow-y: auto;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 0;
  }

  &__title {
    font-size: var(--fs-xl);
  }

  &__desc {
    margin-top: 4px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__close {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    margin: -6px -6px 0 0;
    border-radius: 50%;
    color: var(--c-text-muted);

    &:hover {
      background: rgb(255 255 255 / 0.06);
      color: var(--c-text);
    }
  }

  &__body {
    padding: 20px 24px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 0 24px 24px;
  }

  &__header + &__footer {
    padding-top: 24px;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur) var(--ease);

  .modal__panel {
    transition: transform var(--dur) var(--ease);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__panel {
    transform: translateY(16px) scale(0.98);
  }
}
</style>

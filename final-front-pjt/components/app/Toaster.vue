<script setup lang="ts">
import type { IconName } from '~/components/ui/Icon.vue'
import type { ToastType } from '~/composables/useToast'

const { toasts, dismiss } = useToast()

const ICON: Record<ToastType, IconName> = {
  success: 'check',
  error: 'alert',
  info: 'info',
}
</script>

<template>
  <div
    class="toaster"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        :role="toast.type === 'error' ? 'alert' : 'status'"
      >
        <span class="toast__icon">
          <UiIcon
            :name="ICON[toast.type]"
            :size="16"
            :stroke-width="2.5"
          />
        </span>
        <p class="toast__message">
          {{ toast.message }}
        </p>
        <button
          type="button"
          class="toast__close"
          aria-label="알림 닫기"
          @click="dismiss(toast.id)"
        >
          <UiIcon
            name="x"
            :size="16"
          />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toaster {
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: min(420px, calc(100vw - 32px));
  transform: translateX(-50%);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 12px 12px 14px;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;

  &__icon {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    border-radius: 50%;
  }

  &--success &__icon {
    background: rgb(61 220 151 / 0.16);
    color: var(--c-success);
  }

  &--error &__icon {
    background: var(--c-danger-soft);
    color: var(--c-danger);
  }

  &--info &__icon {
    background: rgb(106 168 255 / 0.16);
    color: var(--c-info);
  }

  &__message {
    flex: 1;
    font-size: var(--fs-sm);
  }

  &__close {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: var(--c-text-subtle);

    &:hover {
      color: var(--c-text);
      background: rgb(255 255 255 / 0.06);
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--dur) var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>

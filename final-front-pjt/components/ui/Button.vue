<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { IconName } from './Icon.vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  to?: RouteLocationRaw
  type?: 'button' | 'submit'
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
  disabled?: boolean
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const isDisabled = computed(() => props.disabled || props.loading)
const iconSize = computed(() => ({ sm: 16, md: 18, lg: 20 })[props.size])
</script>

<template>
  <NuxtLink
    v-if="to && !isDisabled"
    :to="to"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <UiIcon
      v-if="icon"
      :name="icon"
      :size="iconSize"
    />
    <slot />
    <UiIcon
      v-if="iconRight"
      :name="iconRight"
      :size="iconSize"
    />
  </NuxtLink>
  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'btn--loading': loading }]"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
  >
    <UiSpinner
      v-if="loading"
      :size="iconSize"
    />
    <UiIcon
      v-else-if="icon"
      :name="icon"
      :size="iconSize"
    />
    <slot />
    <UiIcon
      v-if="iconRight && !loading"
      :name="iconRight"
      :size="iconSize"
    />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease),
    box-shadow var(--dur) var(--ease);

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--sm {
    height: 34px;
    padding: 0 14px;
    font-size: var(--fs-sm);
  }

  &--md {
    height: 42px;
    padding: 0 20px;
    font-size: var(--fs-sm);
  }

  &--lg {
    height: 52px;
    padding: 0 28px;
    font-size: var(--fs-md);
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background: var(--c-accent);
    color: var(--c-accent-contrast);

    &:hover:not(:disabled) {
      background: var(--c-accent-hover);
      box-shadow: var(--shadow-glow);
    }
  }

  &--secondary {
    background: var(--c-surface-3);
    color: var(--c-text);

    &:hover:not(:disabled) {
      background: #31313f;
    }
  }

  &--outline {
    border-color: var(--c-border-strong);
    color: var(--c-text);

    &:hover:not(:disabled) {
      border-color: var(--c-text-muted);
      background: rgb(255 255 255 / 0.04);
    }
  }

  &--ghost {
    color: var(--c-text-muted);

    &:hover:not(:disabled) {
      color: var(--c-text);
      background: rgb(255 255 255 / 0.06);
    }
  }

  &--danger {
    background: var(--c-danger-soft);
    color: var(--c-danger);

    &:hover:not(:disabled) {
      background: var(--c-danger);
      color: #fff;
    }
  }
}
</style>

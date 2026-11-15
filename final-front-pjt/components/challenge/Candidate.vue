<script setup lang="ts">
import type { Candidate } from '~/types'

defineProps<{
  candidate: Candidate
  side: 'left' | 'right'
  state?: 'idle' | 'chosen' | 'dropped'
  hotkey: string
}>()

defineEmits<{ pick: [] }>()
</script>

<template>
  <button
    type="button"
    class="candidate"
    :class="[`candidate--${side}`, state && `is-${state}`]"
    :aria-label="`${candidate.name} 선택`"
    @click="$emit('pick')"
  >
    <div class="candidate__image">
      <UiPoster
        :src="candidate.image"
        :alt="candidate.name"
        eager
      />
    </div>
    <div class="candidate__overlay">
      <p class="candidate__name">
        {{ candidate.name }}
      </p>
      <span class="candidate__hint">
        <kbd>{{ hotkey }}</kbd> 또는 클릭해서 선택
      </span>
    </div>
    <span
      class="candidate__check"
      aria-hidden="true"
    >
      <UiIcon
        name="check"
        :size="28"
        :stroke-width="3"
      />
    </span>
  </button>
</template>

<style scoped lang="scss">
.candidate {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  text-align: left;
  transition:
    transform 350ms var(--ease),
    opacity 350ms var(--ease),
    box-shadow var(--dur) var(--ease),
    filter 350ms var(--ease);

  &__image :deep(.poster) {
    border-radius: inherit;
  }

  &__overlay {
    position: absolute;
    inset: auto 0 0;
    padding: 48px 20px 20px;
    background: linear-gradient(to top, rgb(0 0 0 / 0.9), transparent);
  }

  &__name {
    font-size: clamp(1rem, 2.4vw, 1.5rem);
    font-weight: 800;
    line-height: 1.3;
    @include line-clamp(2);
  }

  &__hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    font-size: var(--fs-xs);
    color: var(--c-text-muted);

    kbd {
      padding: 1px 6px;
      border: 1px solid var(--c-border-strong);
      border-radius: 4px;
      font-family: inherit;
      font-size: 11px;
    }

    @include down(md) {
      display: none;
    }
  }

  &__check {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--c-accent);
    color: #fff;
    box-shadow: var(--shadow-glow);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
    transition: all 300ms var(--ease);
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 0 0 2px var(--c-accent), var(--shadow-lg);
    }
  }

  &.is-chosen {
    transform: scale(1.03);
    box-shadow: 0 0 0 3px var(--c-accent), var(--shadow-glow);

    .candidate__check {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &.is-dropped {
    opacity: 0.25;
    filter: grayscale(1);
    transform: scale(0.96);
  }
}
</style>

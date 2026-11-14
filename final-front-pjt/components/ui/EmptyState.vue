<script setup lang="ts">
import type { IconName } from './Icon.vue'

withDefaults(defineProps<{
  title: string
  description?: string
  icon?: IconName
}>(), {
  icon: 'film',
})
</script>

<template>
  <div class="empty">
    <span class="empty__icon">
      <UiIcon
        :name="icon"
        :size="28"
      />
    </span>
    <p class="empty__title">
      {{ title }}
    </p>
    <p
      v-if="description"
      class="empty__desc"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      class="empty__action"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 24px;
  text-align: center;
  border: 1px dashed var(--c-border-strong);
  border-radius: var(--radius-lg);
}

.empty__icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: var(--c-surface-2);
  color: var(--c-text-muted);
}

.empty__title {
  font-weight: 700;
  font-size: var(--fs-lg);
}

.empty__desc {
  margin-top: 6px;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
}

.empty__action {
  margin-top: 20px;
}
</style>

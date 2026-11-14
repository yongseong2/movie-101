<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: string
  radius?: string
}>(), {
  width: '100%',
  height: '1em',
  radius: 'var(--radius-sm)',
})
</script>

<template>
  <span
    class="skeleton"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(90deg, var(--c-surface-2) 0%, var(--c-surface-3) 50%, var(--c-surface-2) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
</style>

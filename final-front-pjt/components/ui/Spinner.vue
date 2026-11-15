<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 20 })
</script>

<template>
  <span
    class="spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="status"
  >
    <span class="visually-hidden">불러오는 중</span>
  </span>
</template>

<style scoped>
.spinner {
  display: inline-block;
  flex-shrink: 0;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

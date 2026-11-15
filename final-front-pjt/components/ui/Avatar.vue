<script setup lang="ts">
/** 이미지가 없으면 이니셜과 이름 기반 색상으로 대체하는 아바타 */
const props = withDefaults(defineProps<{
  name: string
  src?: string | null
  size?: number
}>(), {
  size: 36,
})

const img = ref<HTMLImageElement | null>(null)
const failed = ref(false)
watch(() => props.src, () => {
  failed.value = false
})

// 하이드레이션 전에 로드가 실패한 경우(SSR)에도 이니셜로 대체되도록 마운트 시점에 확인
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth === 0) failed.value = true
})

const initial = computed(() => props.name.trim().charAt(0).toUpperCase() || '?')
const hue = computed(() => [...props.name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360)
</script>

<template>
  <span
    class="avatar"
    :style="{ 'width': `${size}px`, 'height': `${size}px`, 'fontSize': `${Math.round(size * 0.42)}px`, '--hue': hue }"
  >
    <img
      v-if="src && !failed"
      ref="img"
      :src="src"
      :alt="`${name} 프로필 사진`"
      loading="lazy"
      @error="failed = true"
    >
    <span
      v-else
      aria-hidden="true"
    >{{ initial }}</span>
  </span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  font-weight: 700;
  color: hsl(var(--hue) 70% 85%);
  background: hsl(var(--hue) 35% 24%);
  box-shadow: 0 0 0 1px var(--c-border);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

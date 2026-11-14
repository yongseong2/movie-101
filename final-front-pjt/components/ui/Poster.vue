<script setup lang="ts">
/** 2:3 비율 포스터 이미지 — 로딩 전 스켈레톤, 실패 시 대체 이미지 */
const props = withDefaults(defineProps<{
  src: string
  alt: string
  eager?: boolean
}>(), {
  eager: false,
})

const img = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const failed = ref(false)
const current = computed(() => (failed.value ? FALLBACK_POSTER : props.src))

watch(() => props.src, () => {
  loaded.value = false
  failed.value = false
})

// SSR 로 렌더링된 이미지는 하이드레이션 전에 load/error 이벤트가 끝날 수 있으므로 마운트 시점에 상태를 동기화한다
onMounted(() => {
  const el = img.value
  if (!el?.complete) return
  if (el.naturalWidth > 0) loaded.value = true
  else failed.value = true
})
</script>

<template>
  <div
    class="poster"
    :class="{ 'is-loaded': loaded }"
  >
    <img
      ref="img"
      :src="current"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @load="loaded = true"
      @error="failed = true"
    >
  </div>
</template>

<style scoped>
.poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: var(--c-surface-2);
}

.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition:
    opacity var(--dur) var(--ease),
    transform 400ms var(--ease);
}

.poster.is-loaded img {
  opacity: 1;
}
</style>

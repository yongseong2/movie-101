<script setup lang="ts">
/**
 * 유튜브 예고편 — 클릭 전까지는 썸네일만 보여주고 iframe 을 지연 로드한다.
 * (기존에는 상세 페이지 API 를 한 번 더 호출해 video_key 를 가져왔으나 부모의 데이터를 props 로 받도록 변경)
 */
const props = defineProps<{
  videoKey: string
  title: string
}>()

const playing = ref(false)
const thumbnail = computed(() => `https://i.ytimg.com/vi/${props.videoKey}/hqdefault.jpg`)
const embedUrl = computed(() => `https://www.youtube-nocookie.com/embed/${props.videoKey}?autoplay=1&rel=0`)
</script>

<template>
  <div class="trailer">
    <iframe
      v-if="playing"
      :src="embedUrl"
      :title="`${title} 예고편`"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <button
      v-else
      type="button"
      class="trailer__cover"
      :aria-label="`${title} 예고편 재생`"
      @click="playing = true"
    >
      <img
        :src="thumbnail"
        alt=""
        loading="lazy"
      >
      <span class="trailer__play">
        <UiIcon
          name="play"
          :size="28"
          filled
          :stroke-width="0"
        />
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.trailer {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: #000;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  &__cover {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.75;
      transition: opacity var(--dur) var(--ease), transform 500ms var(--ease);
    }

    &:hover img {
      opacity: 0.9;
      transform: scale(1.02);
    }
  }

  &__play {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    padding-left: 4px;
    border-radius: 50%;
    background: var(--c-accent);
    color: #fff;
    box-shadow: var(--shadow-glow);
    transform: translate(-50%, -50%);
    transition: transform var(--dur) var(--ease);
  }

  &__cover:hover &__play {
    transform: translate(-50%, -50%) scale(1.08);
  }
}
</style>

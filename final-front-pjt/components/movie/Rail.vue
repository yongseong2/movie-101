<script setup lang="ts">
import type { MovieSummary } from '~/types'

/**
 * 가로 스크롤 영화 목록.
 * Bootstrap carousel 의 DOM 을 직접 복제(cloneNode)하던 방식 대신
 * CSS scroll-snap 과 scrollBy 로 구현해 반응형 · 터치 스와이프를 기본 지원한다.
 */
const props = withDefaults(defineProps<{
  title: string
  movies: MovieSummary[]
  pending?: boolean
  ranked?: boolean
  moreTo?: string
}>(), {
  pending: false,
  ranked: false,
})

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function updateEdges() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

function scroll(direction: 1 | -1) {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' })
}

watch(() => props.movies, () => nextTick(updateEdges))
onMounted(updateEdges)
</script>

<template>
  <section class="rail">
    <header class="rail__header">
      <h2 class="rail__title">
        {{ title }}
      </h2>
      <div class="rail__controls">
        <NuxtLink
          v-if="moreTo"
          :to="moreTo"
          class="rail__more"
        >
          전체보기 <UiIcon
            name="chevron-right"
            :size="16"
          />
        </NuxtLink>
        <button
          type="button"
          class="rail__arrow"
          :disabled="atStart"
          aria-label="이전 영화"
          @click="scroll(-1)"
        >
          <UiIcon
            name="chevron-left"
            :size="18"
          />
        </button>
        <button
          type="button"
          class="rail__arrow"
          :disabled="atEnd"
          aria-label="다음 영화"
          @click="scroll(1)"
        >
          <UiIcon
            name="chevron-right"
            :size="18"
          />
        </button>
      </div>
    </header>

    <div
      ref="track"
      class="rail__track"
      @scroll.passive="updateEdges"
    >
      <template v-if="pending && !movies.length">
        <div
          v-for="n in 8"
          :key="n"
          class="rail__item"
        >
          <UiSkeleton
            height="auto"
            radius="var(--radius-md)"
            style="aspect-ratio: 2 / 3"
          />
          <UiSkeleton
            width="70%"
            height="14px"
            style="margin-top: 10px"
          />
        </div>
      </template>
      <div
        v-for="(movie, index) in movies"
        v-else
        :key="movie.id"
        class="rail__item"
      >
        <MovieCard
          :movie="movie"
          :rank="ranked ? index + 1 : undefined"
          :eager="index < 6"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rail {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__title {
    font-size: var(--fs-xl);
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__more {
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);

    &:hover {
      color: var(--c-text);
    }
  }

  &__arrow {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--c-border-strong);
    border-radius: 50%;
    transition: all var(--dur-fast) var(--ease);

    &:hover:not(:disabled) {
      background: var(--c-text);
      color: var(--c-bg);
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }

    @include down(md) {
      display: none;
    }
  }

  &__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 16px * 5) / 6);
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-bottom: 4px;

    &::-webkit-scrollbar {
      display: none;
    }

    @include down(lg) {
      grid-auto-columns: calc((100% - 16px * 3) / 4);
    }

    @include down(md) {
      grid-auto-columns: 38%;
      gap: 12px;
    }
  }

  &__item {
    scroll-snap-align: start;
    padding-top: 4px;
  }
}
</style>

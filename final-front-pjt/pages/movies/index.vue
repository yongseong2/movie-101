<script setup lang="ts">
import type { MovieCollection } from '~/repositories/tmdb'

useSeoMeta({ title: '영화' })

const TABS: Array<{ value: MovieCollection, label: string }> = [
  { value: 'popular', label: '인기 영화' },
  { value: 'now-playing', label: '현재 상영작' },
]

const route = useRoute()
const tab = computed<MovieCollection>({
  get: () => (route.query.tab === 'now-playing' ? 'now-playing' : 'popular'),
  set: value => navigateTo({ query: { ...route.query, tab: value } }, { replace: true }),
})

const popular = useMovieCollection('popular')
const nowPlaying = useMovieCollection('now-playing')
const active = computed(() => (tab.value === 'popular' ? popular : nowPlaying))
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">
          <UiIcon
            name="film"
            :size="16"
          /> MOVIES
        </p>
        <h1 class="page-header__title">
          지금 가장 뜨거운 영화
        </h1>
        <p class="page-header__desc">
          TMDB 기준 인기작과 국내 현재 상영작을 확인해보세요.
        </p>
      </div>
      <div
        class="tabs"
        role="tablist"
        aria-label="영화 목록 종류"
      >
        <button
          v-for="item in TABS"
          :key="item.value"
          type="button"
          role="tab"
          class="tabs__btn"
          :class="{ 'is-active': tab === item.value }"
          :aria-selected="tab === item.value"
          @click="tab = item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </header>

    <MovieGrid
      v-if="!active.error.value"
      :movies="active.data.value"
      :pending="active.pending.value"
    />

    <UiEmptyState
      v-if="active.error.value"
      icon="alert"
      title="영화 목록을 불러오지 못했어요"
      description="잠시 후 다시 시도해주세요."
    >
      <UiButton
        variant="secondary"
        @click="active.refresh()"
      >
        다시 시도
      </UiButton>
    </UiEmptyState>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  display: inline-flex;
  padding: 4px;
  border-radius: var(--radius-full);
  background: var(--c-surface);
  border: 1px solid var(--c-border);

  &__btn {
    padding: 8px 18px;
    border-radius: var(--radius-full);
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-text-muted);
    transition: all var(--dur-fast) var(--ease);

    &.is-active {
      background: var(--c-text);
      color: var(--c-bg);
    }
  }
}
</style>

<script setup lang="ts">
import type { MovieSummary } from '~/types'

withDefaults(defineProps<{
  movies: MovieSummary[]
  pending?: boolean
  skeletonCount?: number
}>(), {
  pending: false,
  skeletonCount: 12,
})
</script>

<template>
  <div
    class="movie-grid"
    :aria-busy="pending"
  >
    <template v-if="pending && !movies.length">
      <div
        v-for="n in skeletonCount"
        :key="n"
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
    <MovieCard
      v-for="(movie, index) in movies"
      v-else
      :key="movie.id"
      :movie="movie"
      :eager="index < 6"
    />
  </div>
</template>

<style scoped lang="scss">
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 28px 18px;

  @include down(sm) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 12px;
  }
}
</style>

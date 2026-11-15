<script setup lang="ts">
import type { MovieSummary } from '~/types'

const props = defineProps<{
  movie: MovieSummary
  rank?: number
  eager?: boolean
}>()

const year = computed(() => formatYear(props.movie.release_date))
const rating = computed(() => (props.movie.vote_average ? formatRating(props.movie.vote_average) : null))
</script>

<template>
  <NuxtLink
    :to="`/movies/${movie.id}`"
    class="movie-card"
  >
    <div class="movie-card__poster">
      <UiPoster
        :src="tmdbImage(movie.poster_path, 'w342')"
        :alt="`${movie.title} 포스터`"
        :eager="eager"
      />
      <span
        v-if="rank"
        class="movie-card__rank"
      >{{ rank }}</span>
      <span
        v-if="rating"
        class="movie-card__rating"
      >
        <UiIcon
          name="star"
          :size="12"
          filled
          :stroke-width="0"
        />
        {{ rating }}
      </span>
    </div>
    <p class="movie-card__title">
      {{ movie.title }}
    </p>
    <p
      v-if="year"
      class="movie-card__year"
    >
      {{ year }}
    </p>
  </NuxtLink>
</template>

<style scoped lang="scss">
.movie-card {
  display: block;
  min-width: 0;

  &__poster {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--dur) var(--ease),
      box-shadow var(--dur) var(--ease);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.06);
      pointer-events: none;
    }
  }

  &:hover &__poster {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);

    :deep(img) {
      transform: scale(1.04);
    }
  }

  &__rank {
    position: absolute;
    left: 10px;
    bottom: 4px;
    font-size: 3rem;
    font-weight: 900;
    line-height: 1;
    color: #fff;
    text-shadow: 0 2px 12px rgb(0 0 0 / 0.6);
    font-style: italic;
  }

  &__rating {
    position: absolute;
    top: 8px;
    right: 8px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: var(--radius-full);
    font-size: var(--fs-xs);
    font-weight: 700;
    color: var(--c-gold);
    background: rgb(0 0 0 / 0.65);
    backdrop-filter: blur(4px);
  }

  &__title {
    margin-top: 10px;
    font-size: var(--fs-sm);
    font-weight: 600;
    @include line-clamp(1);
  }

  &__year {
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }
}
</style>

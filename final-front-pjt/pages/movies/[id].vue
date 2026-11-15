<script setup lang="ts">
definePageMeta({
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute()
const movieId = Number(route.params.id)

const { data: movie, error } = await useMovie(movieId)

if (error.value || !movie.value) {
  throw createError({ statusCode: 404, statusMessage: '영화를 찾을 수 없습니다.', fatal: true })
}

const year = computed(() => formatYear(movie.value?.release_date))
const trailerKey = computed(() => movie.value?.trailerKeys[0])
const directors = computed(() => movie.value?.directors.slice(0, 3) ?? [])
const casts = computed(() => movie.value?.casts.slice(0, 6) ?? [])

useSeoMeta({
  title: () => movie.value?.title ?? '영화',
  description: () => movie.value?.overview?.slice(0, 150) ?? '',
  ogImage: () => tmdbImage(movie.value?.poster_path, 'w780'),
})
</script>

<template>
  <div
    v-if="movie"
    class="detail"
  >
    <div
      class="detail__backdrop"
      aria-hidden="true"
    >
      <img
        :src="tmdbImage(movie.poster_path, 'w780')"
        alt=""
      >
    </div>

    <div class="container">
      <section class="detail__hero">
        <div class="detail__poster">
          <UiPoster
            :src="tmdbImage(movie.poster_path, 'w500')"
            :alt="`${movie.title} 포스터`"
            eager
          />
        </div>

        <div class="detail__info">
          <div class="detail__meta">
            <span v-if="year">{{ year }}</span>
            <span v-if="movie.release_date">{{ formatDate(movie.release_date) }} 개봉</span>
          </div>
          <h1 class="detail__title">
            {{ movie.title }}
          </h1>

          <ul
            v-if="movie.genres.length"
            class="detail__genres"
          >
            <li
              v-for="genre in movie.genres"
              :key="genre"
            >
              {{ genre }}
            </li>
          </ul>

          <dl class="detail__scores">
            <div class="score">
              <dt>TMDB 평점</dt>
              <dd>
                <UiIcon
                  name="star"
                  :size="18"
                  filled
                  :stroke-width="0"
                  class="score__star"
                />
                {{ formatRating(movie.vote_average) }}<small>/ 10</small>
              </dd>
            </div>
            <div class="score">
              <dt>MOVIE 101 평점</dt>
              <dd>
                <UiIcon
                  name="star"
                  :size="18"
                  filled
                  :stroke-width="0"
                  class="score__star score__star--accent"
                />
                {{ movie.review_count ? formatRating(movie.rate_avg) : '-' }}<small>/ 5</small>
              </dd>
            </div>
            <div class="score">
              <dt>한줄평</dt>
              <dd>{{ movie.review_count }}<small>개</small></dd>
            </div>
          </dl>

          <p
            v-if="movie.overview"
            class="detail__overview"
          >
            {{ movie.overview }}
          </p>

          <dl class="detail__credits">
            <div v-if="directors.length">
              <dt>감독</dt>
              <dd>{{ directors.join(', ') }}</dd>
            </div>
            <div v-if="casts.length">
              <dt>출연</dt>
              <dd>{{ casts.join(', ') }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        v-if="trailerKey"
        class="detail__section"
      >
        <h2 class="detail__section-title">
          예고편
        </h2>
        <MovieTrailer
          :video-key="trailerKey"
          :title="movie.title"
          class="detail__trailer"
        />
      </section>

      <MovieReviewSection
        class="detail__section"
        :movie-id="movie.id"
        :reviews="movie.review_set"
        :average="movie.rate_avg"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail {
  position: relative;
  padding-bottom: 96px;
  isolation: isolate;

  &__backdrop {
    position: absolute;
    inset: 0 0 auto;
    z-index: -1;
    height: 640px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(40px) saturate(1.3);
      opacity: 0.45;
      transform: scale(1.2);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgb(10 10 15 / 0.3), var(--c-bg) 95%);
    }
  }

  &__hero {
    display: grid;
    gap: 32px;
    padding-top: clamp(32px, 6vw, 72px);

    @include up(md) {
      grid-template-columns: 300px 1fr;
      gap: 48px;
      align-items: start;
    }
  }

  &__poster {
    overflow: hidden;
    width: min(260px, 70%);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);

    @include up(md) {
      width: 100%;
    }
  }

  &__meta {
    display: flex;
    gap: 12px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);

    span + span::before {
      content: '·';
      margin-right: 12px;
    }
  }

  &__title {
    margin-top: 8px;
    font-size: var(--fs-3xl);
    font-weight: 800;
  }

  &__genres {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 16px;

    li {
      padding: 4px 12px;
      border: 1px solid var(--c-border-strong);
      border-radius: var(--radius-full);
      font-size: var(--fs-xs);
      color: var(--c-text-muted);
    }
  }

  &__scores {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  &__overview {
    max-width: 720px;
    margin-top: 28px;
    line-height: 1.8;
    color: #d4d4de;
    white-space: pre-line;
  }

  &__credits {
    display: grid;
    gap: 10px;
    margin-top: 24px;
    font-size: var(--fs-sm);

    div {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: 12px;
    }

    dt {
      color: var(--c-text-subtle);
    }
  }

  &__section {
    margin-top: 72px;
  }

  &__section-title {
    margin-bottom: 20px;
    font-size: var(--fs-2xl);
  }

  &__trailer {
    max-width: 960px;
  }
}

.score {
  min-width: 132px;
  padding: 14px 18px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: rgb(22 22 31 / 0.7);
  backdrop-filter: blur(8px);

  dt {
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  dd {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: var(--fs-xl);
    font-weight: 700;

    small {
      font-size: var(--fs-xs);
      font-weight: 500;
      color: var(--c-text-subtle);
    }
  }

  &__star {
    color: var(--c-gold);

    &--accent {
      color: var(--c-accent);
    }
  }
}
</style>

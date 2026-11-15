<script setup lang="ts">
import type { IconName } from '~/components/ui/Icon.vue'

useSeoMeta({ title: '홈', titleTemplate: 'MOVIE 101 — 토너먼트로 찾는 내 취향 영화' })

const { data: nowPlaying, pending: nowPlayingPending } = useMovieCollection('now-playing')
const { data: popular, pending: popularPending } = useMovieCollection('popular')
const randomMovie = useRandomMovie()

const mosaic = computed(() => [...popular.value, ...nowPlaying.value].filter(m => m.poster_path).slice(0, 18))
const topTen = computed(() => popular.value.slice(0, 10))

interface Feature {
  icon: IconName
  title: string
  description: string
  to?: string
  action?: () => void
  cta: string
}

const features: Feature[] = [
  {
    icon: 'trophy',
    title: '영화 월드컵 32강',
    description: '1:1 대결로 끝까지 살아남은 영화를 고르면, 비슷한 장르의 평점 8점 이상 명작을 추천해드려요.',
    to: '/challenge/movie',
    cta: '월드컵 시작',
  },
  {
    icon: 'users',
    title: '배우 월드컵 32강',
    description: '최애 배우를 가려내면 그 배우의 필모그래피에서 오늘 볼 영화를 골라드려요.',
    to: '/challenge/actor',
    cta: '월드컵 시작',
  },
  {
    icon: 'shuffle',
    title: '랜덤 영화',
    description: '고민할 시간도 아깝다면, MOVIE 101 이 수집한 영화 중 하나를 무작위로 뽑아드려요.',
    action: () => randomMovie.run(),
    cta: '지금 뽑기',
  },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div
        class="hero__mosaic"
        aria-hidden="true"
      >
        <img
          v-for="movie in mosaic"
          :key="movie.id"
          :src="tmdbImage(movie.poster_path, 'w185')"
          alt=""
          loading="lazy"
        >
      </div>
      <div class="hero__content container">
        <p class="hero__eyebrow">
          <UiIcon
            name="sparkles"
            :size="16"
          /> 32강 토너먼트 영화 추천
        </p>
        <h1 class="hero__title">
          오늘 밤 볼 영화,<br>
          <span>토너먼트</span>로 골라보세요
        </h1>
        <p class="hero__desc">
          영화·배우 월드컵부터 랜덤 추천까지. 몇 번의 선택만으로 취향에 꼭 맞는 영화를 찾아드려요.
        </p>
        <div class="hero__actions">
          <UiButton
            to="/challenge/movie"
            size="lg"
            icon="trophy"
          >
            영화 월드컵 시작하기
          </UiButton>
          <UiButton
            variant="outline"
            size="lg"
            icon="shuffle"
            :loading="randomMovie.pending.value"
            @click="randomMovie.run()"
          >
            랜덤 영화 뽑기
          </UiButton>
        </div>
      </div>
    </section>

    <div class="container home__sections">
      <section
        class="features"
        aria-label="추천 방식"
      >
        <article
          v-for="feature in features"
          :key="feature.title"
          class="feature"
        >
          <span class="feature__icon">
            <UiIcon
              :name="feature.icon"
              :size="22"
            />
          </span>
          <h2 class="feature__title">
            {{ feature.title }}
          </h2>
          <p class="feature__desc">
            {{ feature.description }}
          </p>
          <UiButton
            v-if="feature.to"
            :to="feature.to"
            variant="secondary"
            size="sm"
            icon-right="arrow-right"
          >
            {{ feature.cta }}
          </UiButton>
          <UiButton
            v-else
            variant="secondary"
            size="sm"
            icon-right="arrow-right"
            :loading="randomMovie.pending.value"
            @click="feature.action?.()"
          >
            {{ feature.cta }}
          </UiButton>
        </article>
      </section>

      <MovieRail
        title="지금 상영 중"
        :movies="nowPlaying"
        :pending="nowPlayingPending"
        more-to="/movies?tab=now-playing"
      />
      <MovieRail
        title="오늘의 인기 TOP 10"
        :movies="topTen"
        :pending="popularPending"
        ranked
        more-to="/movies"
      />

      <section class="cta">
        <div>
          <h2 class="cta__title">
            방금 본 영화, 이야기 나눌 사람?
          </h2>
          <p class="cta__desc">
            커뮤니티에서 감상을 공유하고 다른 사람들의 해석을 만나보세요.
          </p>
        </div>
        <UiButton
          to="/community"
          variant="primary"
          icon="message"
        >
          커뮤니티 가기
        </UiButton>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: min(78vh, 720px);
  overflow: hidden;
  isolation: isolate;

  &__mosaic {
    position: absolute;
    inset: -30% -8% -30% 38%;
    z-index: -2;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-content: center;
    gap: 14px;
    transform: rotate(-10deg);
    opacity: 0.7;

    img {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    @include down(md) {
      inset: -20% -20% -20% 0;
      opacity: 0.35;
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(90deg, var(--c-bg) 25%, rgb(10 10 15 / 0.75) 55%, rgb(10 10 15 / 0.2) 100%),
      linear-gradient(to bottom, rgb(10 10 15 / 0.6), transparent 25%, transparent 70%, var(--c-bg));
  }

  &__content {
    padding-block: 80px;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid rgb(255 77 109 / 0.35);
    border-radius: var(--radius-full);
    background: var(--c-accent-soft);
    color: var(--c-accent-hover);
    font-size: var(--fs-sm);
    font-weight: 600;
  }

  &__title {
    margin-top: 24px;
    font-size: var(--fs-display);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;

    span {
      background: linear-gradient(120deg, var(--c-accent) 10%, var(--c-gold) 90%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  &__desc {
    max-width: 520px;
    margin-top: 20px;
    font-size: var(--fs-lg);
    color: var(--c-text-muted);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 36px;
  }
}

.home__sections {
  display: flex;
  flex-direction: column;
  gap: 64px;
  padding-bottom: 96px;
}

.features {
  display: grid;
  gap: 16px;

  @include up(md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 28px;
  background: linear-gradient(160deg, var(--c-surface-2), var(--c-surface));
  border: 1px solid var(--c-border);
  border-radius: var(--radius-xl);
  transition: border-color var(--dur) var(--ease), transform var(--dur) var(--ease);

  &:hover {
    border-color: rgb(255 77 109 / 0.35);
    transform: translateY(-2px);
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 6px;
    border-radius: var(--radius-md);
    background: var(--c-accent-soft);
    color: var(--c-accent);
  }

  &__title {
    font-size: var(--fs-lg);
  }

  &__desc {
    flex: 1;
    margin-bottom: 8px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
}

.cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 40px;
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 100% 0%, rgb(255 200 87 / 0.18), transparent 50%),
    radial-gradient(circle at 0% 100%, rgb(255 77 109 / 0.22), transparent 55%),
    var(--c-surface);
  border: 1px solid var(--c-border);

  &__title {
    font-size: var(--fs-2xl);
  }

  &__desc {
    margin-top: 6px;
    color: var(--c-text-muted);
  }
}
</style>

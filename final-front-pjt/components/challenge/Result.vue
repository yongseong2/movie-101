<script setup lang="ts">
import type { Candidate, RecommendedMovie } from '~/types'

const props = defineProps<{
  champion: Candidate
  label: string
  fetchRecommendation: (id: number) => Promise<RecommendedMovie>
}>()

defineEmits<{ restart: [] }>()

// 우승자가 정해진 뒤 자동으로 추천을 요청한다 (기존에는 버튼을 한 번 더 눌러야 했다)
const { data: recommendation, status, refresh } = useAsyncData(
  `challenge:recommendation:${props.champion.id}`,
  () => props.fetchRecommendation(props.champion.id),
  { server: false },
)
</script>

<template>
  <section class="result">
    <div class="result__champion">
      <p class="result__eyebrow">
        <UiIcon
          name="trophy"
          :size="18"
        /> 최종 우승
      </p>
      <div class="result__winner">
        <UiPoster
          :src="champion.image"
          :alt="champion.name"
          eager
        />
      </div>
      <h2 class="result__name">
        {{ champion.name }}
      </h2>
    </div>

    <div class="result__recommend">
      <p class="result__label">
        {{ label }}
      </p>
      <h3 class="result__heading">
        이 영화는 어때요?
      </h3>

      <div
        v-if="status === 'pending' || status === 'idle'"
        class="recommend recommend--loading"
      >
        <UiSkeleton
          width="140px"
          height="210px"
          radius="var(--radius-md)"
        />
        <div class="recommend__body">
          <UiSkeleton
            width="60%"
            height="24px"
          />
          <UiSkeleton
            height="14px"
            style="margin-top: 16px"
          />
          <UiSkeleton
            height="14px"
            style="margin-top: 8px"
          />
          <UiSkeleton
            width="80%"
            height="14px"
            style="margin-top: 8px"
          />
          <p class="recommend__wait">
            취향에 맞는 영화를 찾는 중이에요…
          </p>
        </div>
      </div>

      <UiEmptyState
        v-else-if="status === 'error' || !recommendation"
        icon="alert"
        title="추천 영화를 찾지 못했어요"
      >
        <UiButton
          variant="secondary"
          @click="refresh()"
        >
          다시 추천받기
        </UiButton>
      </UiEmptyState>

      <article
        v-else
        class="recommend"
      >
        <div class="recommend__poster">
          <UiPoster
            :src="tmdbImage(recommendation.poster_path, 'w342')"
            :alt="`${recommendation.title} 포스터`"
          />
        </div>
        <div class="recommend__body">
          <h4 class="recommend__title">
            {{ recommendation.title }}
          </h4>
          <p class="recommend__overview">
            {{ recommendation.overview || '등록된 줄거리가 없습니다.' }}
          </p>
          <UiButton
            :to="{ path: '/search', query: { q: recommendation.title } }"
            variant="secondary"
            size="sm"
            icon-right="arrow-right"
          >
            영화 정보 보기
          </UiButton>
        </div>
      </article>

      <div class="result__actions">
        <UiButton
          icon="undo"
          @click="$emit('restart')"
        >
          다시 하기
        </UiButton>
        <UiButton
          to="/"
          variant="ghost"
        >
          홈으로
        </UiButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.result {
  display: grid;
  gap: 40px;
  align-items: center;

  @include up(lg) {
    grid-template-columns: minmax(0, 360px) 1fr;
    gap: 64px;
  }

  &__champion {
    text-align: center;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    margin-bottom: 20px;
    border-radius: var(--radius-full);
    background: var(--c-gold-soft);
    color: var(--c-gold);
    font-weight: 700;
    font-size: var(--fs-sm);
  }

  &__winner {
    position: relative;
    max-width: 300px;
    margin-inline: auto;
    overflow: hidden;
    border-radius: var(--radius-xl);
    box-shadow: 0 0 0 3px var(--c-gold), 0 20px 80px rgb(255 200 87 / 0.3);
    animation: rise 700ms var(--ease) both;
  }

  &__name {
    margin-top: 20px;
    font-size: var(--fs-2xl);
  }

  &__label {
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-accent);
  }

  &__heading {
    margin-top: 4px;
    font-size: var(--fs-3xl);
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 32px;
  }
}

.recommend {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding: 24px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-xl);
  animation: rise 500ms 150ms var(--ease) both;

  @include down(sm) {
    flex-direction: column;
  }

  &__poster {
    flex-shrink: 0;
    width: 140px;
    overflow: hidden;
    border-radius: var(--radius-md);
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }

  &__title {
    font-size: var(--fs-xl);
  }

  &__overview {
    margin: 12px 0 20px;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    line-height: 1.75;
    @include line-clamp(6);
  }

  &__wait {
    margin-top: 20px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
}
</style>

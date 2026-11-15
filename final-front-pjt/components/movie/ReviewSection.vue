<script setup lang="ts">
import type { Review, ReviewPayload } from '~/types'

const props = defineProps<{
  movieId: number
  reviews: Review[]
  average: number
}>()

const auth = useAuthStore()
const route = useRoute()

// 부모 컴포넌트의 함수를 props 로 내려받던 방식 대신, useMovie 의 캐시 키로 상세 데이터를 갱신한다
const actions = useReviewActions(props.movieId, () => refreshNuxtData(movieDataKey(props.movieId)))

const modalOpen = ref(false)
const editing = ref<Review | null>(null)

const initial = computed<ReviewPayload | undefined>(() =>
  editing.value ? { review: editing.value.review ?? '', rate: editing.value.rate } : undefined,
)
const pending = computed(() => actions.create.pending.value || actions.update.pending.value)

function openCreate() {
  if (!auth.isLoggedIn) {
    navigateTo({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  editing.value = null
  modalOpen.value = true
}

function openEdit(review: Review) {
  editing.value = review
  modalOpen.value = true
}

async function submit(payload: ReviewPayload) {
  const done = editing.value
    ? await actions.update.run(editing.value.id, payload)
    : await actions.create.run(payload)
  if (done) modalOpen.value = false
}
</script>

<template>
  <section
    class="reviews"
    aria-labelledby="reviews-title"
  >
    <header class="reviews__header">
      <div>
        <h2
          id="reviews-title"
          class="reviews__title"
        >
          한줄평 <span class="reviews__count">{{ reviews.length }}</span>
        </h2>
        <div
          v-if="reviews.length"
          class="reviews__summary"
        >
          <UiStarRating
            :model-value="average"
            readonly
            :size="16"
          />
          <strong>{{ formatRating(average) }}</strong>
          <span class="text-muted">/ 5</span>
        </div>
      </div>
      <UiButton
        icon="edit"
        @click="openCreate"
      >
        한줄평 쓰기
      </UiButton>
    </header>

    <div
      v-if="reviews.length"
      class="reviews__list"
    >
      <MovieReviewItem
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        @edit="openEdit"
        @remove="actions.remove.run($event.id)"
      />
    </div>
    <UiEmptyState
      v-else
      icon="message"
      title="아직 한줄평이 없어요"
      description="이 영화의 첫 번째 한줄평을 남겨보세요."
    />

    <UiModal
      v-model:open="modalOpen"
      :title="editing ? '한줄평 수정' : '한줄평 쓰기'"
      description="0~5점의 별점과 함께 최대 300자까지 남길 수 있어요."
    >
      <MovieReviewForm
        :key="editing?.id ?? 'new'"
        :initial="initial"
        :pending="pending"
        :submit-label="editing ? '수정하기' : '등록하기'"
        @submit="submit"
        @cancel="modalOpen = false"
      />
    </UiModal>
  </section>
</template>

<style scoped lang="scss">
.reviews {
  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: var(--fs-2xl);
  }

  &__count {
    color: var(--c-accent);
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    font-size: var(--fs-sm);
  }

  &__list {
    display: grid;
    gap: 12px;

    @include up(md) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>

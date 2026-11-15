<script setup lang="ts">
import type { Review } from '~/types'

const props = defineProps<{ review: Review }>()
const emit = defineEmits<{ edit: [review: Review], remove: [review: Review] }>()

const auth = useAuthStore()
const isMine = computed(() => auth.isMe(props.review.username))
const edited = computed(() => props.review.updated_at && props.review.updated_at !== props.review.created_at)
</script>

<template>
  <article class="review">
    <header class="review__header">
      <NuxtLink
        :to="`/profile/${review.username}`"
        class="review__author"
      >
        <UiAvatar
          :name="review.username"
          :size="32"
        />
        <span class="review__name">{{ review.username }}</span>
      </NuxtLink>
      <time
        class="review__date"
        :datetime="review.created_at"
        :title="formatDateTime(review.created_at)"
      >
        {{ formatRelativeTime(review.created_at) }}<template v-if="edited"> · 수정됨</template>
      </time>
    </header>
    <UiStarRating
      :model-value="review.rate"
      readonly
      :size="14"
      class="review__stars"
    />
    <p class="review__body">
      {{ review.review }}
    </p>
    <footer
      v-if="isMine"
      class="review__actions"
    >
      <UiButton
        variant="ghost"
        size="sm"
        icon="edit"
        @click="emit('edit', review)"
      >
        수정
      </UiButton>
      <UiButton
        variant="ghost"
        size="sm"
        icon="trash"
        @click="emit('remove', review)"
      >
        삭제
      </UiButton>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.review {
  padding: 20px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;

    &:hover .review__name {
      text-decoration: underline;
    }
  }

  &__name {
    font-weight: 600;
    font-size: var(--fs-sm);
  }

  &__date {
    flex-shrink: 0;
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  &__stars {
    margin-top: 12px;
  }

  &__body {
    margin-top: 6px;
    white-space: pre-line;
    color: var(--c-text);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    margin: 8px -8px -8px 0;
  }
}
</style>

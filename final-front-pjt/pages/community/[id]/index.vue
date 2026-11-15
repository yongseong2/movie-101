<script setup lang="ts">
definePageMeta({
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute()
const articleId = Number(route.params.id)

const { data: article, error } = await useArticle(articleId)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: '게시글을 찾을 수 없습니다.', fatal: true })
}

const { remove } = useArticleActions()
const edited = computed(() => article.value && article.value.updated_at !== article.value.created_at)

useSeoMeta({
  title: () => article.value?.title ?? '게시글',
  description: () => article.value?.content.slice(0, 150) ?? '',
})
</script>

<template>
  <div
    v-if="article"
    class="page container container--narrow"
  >
    <NuxtLink
      to="/community"
      class="back"
    >
      <UiIcon
        name="arrow-left"
        :size="16"
      /> 목록으로
    </NuxtLink>

    <article class="post surface">
      <header class="post__header">
        <h1 class="post__title">
          {{ article.title }}
        </h1>
        <div class="post__meta">
          <NuxtLink
            :to="`/profile/${article.username}`"
            class="post__author"
          >
            <UiAvatar
              :name="article.username"
              :size="40"
            />
            <div>
              <p class="post__name">
                {{ article.username }}
              </p>
              <p class="post__date">
                <time :datetime="article.created_at">{{ formatDateTime(article.created_at) }}</time>
                <template v-if="edited">
                  · 수정됨
                </template>
              </p>
            </div>
          </NuxtLink>
          <div
            v-if="article.is_mine"
            class="post__actions"
          >
            <UiButton
              :to="`/community/${article.id}/edit`"
              variant="ghost"
              size="sm"
              icon="edit"
            >
              수정
            </UiButton>
            <UiButton
              variant="ghost"
              size="sm"
              icon="trash"
              :loading="remove.pending.value"
              @click="remove.run(article.id)"
            >
              삭제
            </UiButton>
          </div>
        </div>
      </header>

      <div class="post__content">
        {{ article.content }}
      </div>

      <CommunityCommentSection
        class="post__comments"
        :article-id="article.id"
        :comments="article.comment_set"
      />
    </article>
  </div>
</template>

<style scoped lang="scss">
.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);

  &:hover {
    color: var(--c-text);
  }
}

.post {
  padding: clamp(24px, 5vw, 48px);

  &__title {
    font-size: var(--fs-3xl);
    font-weight: 800;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 24px;
    margin-top: 24px;
    border-bottom: 1px solid var(--c-border);
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__name {
    font-weight: 700;
  }

  &__date {
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  &__actions {
    display: flex;
    gap: 4px;
  }

  &__content {
    padding-block: 32px 48px;
    font-size: var(--fs-lg);
    line-height: 1.85;
    white-space: pre-line;
  }

  &__comments {
    padding-top: 32px;
    border-top: 1px solid var(--c-border);
  }
}
</style>

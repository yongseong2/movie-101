<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
  validate: route => /^\d+$/.test(String(route.params.id)),
})
useSeoMeta({ title: '글 수정' })

const route = useRoute()
const articleId = Number(route.params.id)

const { data: article, error } = await useArticle(articleId)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: '게시글을 찾을 수 없습니다.', fatal: true })
}
// 작성자가 아니면 수정 화면에 진입할 수 없다 (기존에는 저장 시점에 서버 406 응답으로만 막혔다)
if (!article.value.is_mine) {
  throw createError({ statusCode: 403, statusMessage: '본인이 작성한 글만 수정할 수 있습니다.', fatal: true })
}

const { update } = useArticleActions()
const initial = { title: article.value.title, content: article.value.content }
</script>

<template>
  <div class="page container container--narrow">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">
          <UiIcon
            name="edit"
            :size="16"
          /> EDIT POST
        </p>
        <h1 class="page-header__title">
          게시글 수정
        </h1>
      </div>
    </header>
    <CommunityArticleForm
      :initial="initial"
      submit-label="수정 완료"
      :pending="update.pending.value"
      @submit="update.run(articleId, $event)"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ requiresAuth: true })
useSeoMeta({ title: '새 글 작성' })

const { create } = useArticleActions()
</script>

<template>
  <div class="page container container--narrow">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">
          <UiIcon
            name="edit"
            :size="16"
          /> NEW POST
        </p>
        <h1 class="page-header__title">
          새 토론 시작하기
        </h1>
      </div>
    </header>
    <CommunityArticleForm
      submit-label="등록하기"
      :pending="create.pending.value"
      @submit="create.run"
    />
  </div>
</template>

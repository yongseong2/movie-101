<script setup lang="ts">
import type { ArticlePayload } from '~/types'

/** 게시글 작성 · 수정 페이지가 공유하는 폼 (기존에는 두 페이지에 각각 구현되어 있었다) */
const props = defineProps<{
  initial?: ArticlePayload
  pending?: boolean
  submitLabel: string
}>()

const emit = defineEmits<{ submit: [payload: ArticlePayload] }>()

const title = ref(props.initial?.title ?? '')
const content = ref(props.initial?.content ?? '')
const submitted = ref(false)

const errors = computed(() => ({
  title: submitted.value && !title.value.trim() ? '제목을 입력해주세요.' : '',
  content: submitted.value && !content.value.trim() ? '내용을 입력해주세요.' : '',
}))

function onSubmit() {
  submitted.value = true
  if (errors.value.title || errors.value.content) return
  emit('submit', { title: title.value.trim(), content: content.value.trim() })
}
</script>

<template>
  <form
    class="article-form surface"
    novalidate
    @submit.prevent="onSubmit"
  >
    <UiField
      v-model="title"
      label="제목"
      placeholder="제목을 입력하세요"
      :maxlength="100"
      :error="errors.title"
      required
    />
    <UiField
      v-model="content"
      label="내용"
      multiline
      :rows="12"
      placeholder="영화에 대한 생각을 자유롭게 나눠주세요."
      :error="errors.content"
      required
    />
    <div class="article-form__actions">
      <UiButton
        variant="ghost"
        @click="$router.back()"
      >
        취소
      </UiButton>
      <UiButton
        type="submit"
        :loading="pending"
      >
        {{ submitLabel }}
      </UiButton>
    </div>
  </form>
</template>

<style scoped>
.article-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: clamp(20px, 4vw, 32px);
}

.article-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

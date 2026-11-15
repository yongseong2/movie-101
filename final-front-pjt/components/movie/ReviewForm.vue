<script setup lang="ts">
import type { ReviewPayload } from '~/types'

const MAX_LENGTH = 300

const props = defineProps<{
  initial?: ReviewPayload
  pending?: boolean
  submitLabel: string
}>()

const emit = defineEmits<{
  submit: [payload: ReviewPayload]
  cancel: []
}>()

const review = ref(props.initial?.review ?? '')
const rate = ref(props.initial?.rate ?? 0)
const touched = ref(false)

const error = computed(() => (touched.value && !review.value.trim() ? '한줄평을 입력해주세요.' : ''))

function onSubmit() {
  touched.value = true
  if (!review.value.trim()) return
  emit('submit', { review: review.value.trim(), rate: rate.value })
}
</script>

<template>
  <form
    class="review-form"
    @submit.prevent="onSubmit"
  >
    <div class="review-form__rate">
      <span class="review-form__label">평점</span>
      <UiStarRating
        v-model="rate"
        :size="28"
      />
    </div>
    <UiField
      v-model="review"
      label="한줄평"
      multiline
      :rows="4"
      :maxlength="MAX_LENGTH"
      placeholder="이 영화, 어떠셨나요? 스포일러는 자제해주세요."
      :error="error"
    />
    <div class="review-form__actions">
      <UiButton
        variant="ghost"
        @click="emit('cancel')"
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
.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-form__rate {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-form__label {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--c-text-muted);
}

.review-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

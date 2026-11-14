<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
const title = computed(() => {
  if (is404.value) return '찾으시는 장면이 편집됐나 봐요'
  if (props.error.statusCode === 403) return '접근할 수 없는 페이지예요'
  return '상영 중 문제가 발생했어요'
})
const message = computed(() =>
  is404.value ? '주소가 잘못되었거나, 삭제된 페이지입니다.' : props.error.statusMessage || '잠시 후 다시 시도해주세요.',
)

useSeoMeta({ title: () => String(props.error.statusCode) })

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <section class="error container">
      <p class="error__code">
        {{ error.statusCode }}
      </p>
      <h1 class="error__title">
        {{ title }}
      </h1>
      <p class="error__message">
        {{ message }}
      </p>
      <div class="error__actions">
        <UiButton
          icon="arrow-left"
          variant="ghost"
          @click="$router.back()"
        >
          이전 페이지
        </UiButton>
        <UiButton @click="goHome">
          홈으로 가기
        </UiButton>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding-block: 80px;
  text-align: center;
}

.error__code {
  font-size: clamp(6rem, 20vw, 10rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.06em;
  background: linear-gradient(120deg, var(--c-accent), var(--c-gold));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.error__title {
  margin-top: 16px;
  font-size: var(--fs-2xl);
}

.error__message {
  margin-top: 8px;
  color: var(--c-text-muted);
}

.error__actions {
  display: flex;
  gap: 8px;
  margin-top: 32px;
}
</style>

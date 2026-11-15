<script setup lang="ts">
definePageMeta({ guestOnly: true })
useSeoMeta({ title: '로그인' })

const route = useRoute()
const { login } = useAuth()

const form = reactive({ username: '', password: '' })
const canSubmit = computed(() => form.username.trim() && form.password)

const notice = computed(() => {
  if (route.query.expired) return '로그인이 만료되었어요. 다시 로그인해주세요.'
  if (route.query.redirect) return '로그인이 필요한 서비스입니다.'
  return ''
})

function onSubmit() {
  if (!canSubmit.value) return
  login.run({ username: form.username.trim(), password: form.password })
}
</script>

<template>
  <AuthCard
    title="다시 만나서 반가워요"
    description="로그인하고 나만의 영화 취향을 찾아보세요."
  >
    <template
      v-if="notice"
      #notice
    >
      {{ notice }}
    </template>

    <form
      class="form-stack"
      @submit.prevent="onSubmit"
    >
      <UiField
        v-model="form.username"
        label="아이디"
        autocomplete="username"
        placeholder="아이디를 입력하세요"
        required
      />
      <UiField
        v-model="form.password"
        label="비밀번호"
        type="password"
        autocomplete="current-password"
        placeholder="비밀번호를 입력하세요"
        required
      />
      <UiButton
        type="submit"
        size="lg"
        block
        :loading="login.pending.value"
        :disabled="!canSubmit"
      >
        로그인
      </UiButton>
    </form>

    <template #footer>
      아직 회원이 아니신가요?
      <NuxtLink :to="{ path: '/signup', query: route.query.redirect ? { redirect: route.query.redirect } : {} }">
        회원가입
      </NuxtLink>
    </template>
  </AuthCard>
</template>

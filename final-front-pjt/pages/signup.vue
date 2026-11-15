<script setup lang="ts">
definePageMeta({ guestOnly: true })
useSeoMeta({ title: '회원가입' })

const { signUp } = useAuth()

const form = reactive({ username: '', password1: '', password2: '' })
const touched = reactive({ password1: false, password2: false })

// 서버 검증 전에 클라이언트에서 먼저 안내 (dj-rest-auth 기본 정책: 8자 이상 · 숫자만 불가)
const errors = computed(() => ({
  password1: touched.password1 && form.password1.length > 0 && form.password1.length < 8
    ? '비밀번호는 8자 이상이어야 합니다.'
    : touched.password1 && /^\d+$/.test(form.password1)
      ? '비밀번호는 숫자로만 구성할 수 없습니다.'
      : '',
  password2: touched.password2 && form.password2 && form.password1 !== form.password2
    ? '비밀번호가 서로 일치하지 않습니다.'
    : '',
}))

const canSubmit = computed(() =>
  form.username.trim()
  && form.password1.length >= 8
  && form.password1 === form.password2
  && !errors.value.password1,
)

watch(() => form.password1, () => {
  touched.password1 = true
})
watch(() => form.password2, () => {
  touched.password2 = true
})

function onSubmit() {
  if (!canSubmit.value) return
  signUp.run({ username: form.username.trim(), password1: form.password1, password2: form.password2 })
}
</script>

<template>
  <AuthCard
    title="MOVIE 101 시작하기"
    description="가입하고 영화 월드컵, 리뷰, 커뮤니티를 모두 이용해보세요."
  >
    <form
      class="form-stack"
      @submit.prevent="onSubmit"
    >
      <UiField
        v-model="form.username"
        label="아이디"
        autocomplete="username"
        placeholder="사용할 아이디"
        :maxlength="150"
        required
      />
      <UiField
        v-model="form.password1"
        label="비밀번호"
        type="password"
        autocomplete="new-password"
        placeholder="8자 이상"
        hint="8자 이상, 숫자로만 구성할 수 없어요."
        :error="errors.password1"
        required
      />
      <UiField
        v-model="form.password2"
        label="비밀번호 확인"
        type="password"
        autocomplete="new-password"
        placeholder="비밀번호를 한 번 더 입력하세요"
        :error="errors.password2"
        required
      />
      <UiButton
        type="submit"
        size="lg"
        block
        :loading="signUp.pending.value"
        :disabled="!canSubmit"
      >
        가입하기
      </UiButton>
    </form>

    <template #footer>
      이미 계정이 있으신가요?
      <NuxtLink to="/login">
        로그인
      </NuxtLink>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
definePageMeta({ requiresAuth: true })
useSeoMeta({ title: '비밀번호 변경' })

const { changePassword } = useAuth()

const form = reactive({ password1: '', password2: '' })

const mismatch = computed(() => Boolean(form.password2) && form.password1 !== form.password2)
const canSubmit = computed(() => form.password1.length >= 8 && form.password1 === form.password2)

function onSubmit() {
  if (!canSubmit.value) return
  changePassword.run({ new_password1: form.password1, new_password2: form.password2 })
}
</script>

<template>
  <AuthCard
    title="비밀번호 변경"
    description="변경 후에는 보안을 위해 다시 로그인해야 해요."
  >
    <form
      class="form-stack"
      @submit.prevent="onSubmit"
    >
      <UiField
        v-model="form.password1"
        label="새 비밀번호"
        type="password"
        autocomplete="new-password"
        placeholder="8자 이상"
        hint="8자 이상, 숫자로만 구성할 수 없어요."
        required
      />
      <UiField
        v-model="form.password2"
        label="새 비밀번호 확인"
        type="password"
        autocomplete="new-password"
        :error="mismatch ? '비밀번호가 서로 일치하지 않습니다.' : ''"
        required
      />
      <UiButton
        type="submit"
        size="lg"
        block
        :loading="changePassword.pending.value"
        :disabled="!canSubmit"
      >
        변경하기
      </UiButton>
    </form>
    <template #footer>
      <UiButton
        variant="ghost"
        size="sm"
        icon="arrow-left"
        @click="$router.back()"
      >
        돌아가기
      </UiButton>
    </template>
  </AuthCard>
</template>

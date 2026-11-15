<script setup lang="ts">
const { dialog, settle } = useConfirm()

// UiModal 의 v-model:open 과 연결 — 모달이 닫히면(ESC · 배경 클릭) 취소로 처리
const open = computed({
  get: () => dialog.value !== null,
  set: (value) => {
    if (!value) settle(false)
  },
})
</script>

<template>
  <UiModal
    v-model:open="open"
    :title="dialog?.title ?? ''"
    :description="dialog?.message"
    :width="420"
  >
    <template #footer>
      <UiButton
        variant="ghost"
        @click="settle(false)"
      >
        {{ dialog?.cancelText ?? '취소' }}
      </UiButton>
      <UiButton
        :variant="dialog?.danger ? 'danger' : 'primary'"
        @click="settle(true)"
      >
        {{ dialog?.confirmText ?? '확인' }}
      </UiButton>
    </template>
  </UiModal>
</template>

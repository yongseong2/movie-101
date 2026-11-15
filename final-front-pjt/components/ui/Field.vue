<script setup lang="ts">
/**
 * 라벨 · 입력 · 에러/도움말을 묶는 폼 필드.
 * input 과 textarea 를 하나의 컴포넌트로 처리하며 v-model 은 defineModel 로 연결한다.
 */
const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
  label: string
  type?: 'text' | 'password' | 'search'
  multiline?: boolean
  rows?: number
  placeholder?: string
  autocomplete?: string
  maxlength?: number
  error?: string
  hint?: string
  required?: boolean
  hideLabel?: boolean
}>(), {
  type: 'text',
  rows: 6,
})

const id = useId()
const describedBy = computed(() => (props.error || props.hint ? `${id}-desc` : undefined))
</script>

<template>
  <div
    class="field"
    :class="{ 'field--error': error }"
  >
    <label
      :for="id"
      class="field__label"
      :class="{ 'visually-hidden': hideLabel }"
    >
      {{ label }}
      <span
        v-if="required"
        class="field__required"
        aria-hidden="true"
      >*</span>
    </label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      class="field__control field__control--multiline"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :required="required"
      :aria-invalid="!!error || undefined"
      :aria-describedby="describedBy"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      class="field__control"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :required="required"
      :aria-invalid="!!error || undefined"
      :aria-describedby="describedBy"
    >
    <div
      v-if="error || hint || maxlength"
      class="field__meta"
    >
      <p
        v-if="error || hint"
        :id="`${id}-desc`"
        class="field__desc"
      >
        {{ error || hint }}
      </p>
      <span
        v-if="maxlength"
        class="field__count"
      >{{ model.length }} / {{ maxlength }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-text-muted);
  }

  &__required {
    color: var(--c-accent);
  }

  &__control {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    background: var(--c-bg-elevated);
    border: 1px solid var(--c-border-strong);
    border-radius: var(--radius-md);
    transition:
      border-color var(--dur-fast) var(--ease),
      box-shadow var(--dur-fast) var(--ease);

    &::placeholder {
      color: var(--c-text-subtle);
    }

    &:hover {
      border-color: rgb(255 255 255 / 0.24);
    }

    &:focus {
      outline: none;
      border-color: var(--c-accent);
      box-shadow: 0 0 0 4px var(--c-accent-soft);
    }

    &--multiline {
      height: auto;
      padding: 14px 16px;
      line-height: 1.7;
      resize: vertical;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: var(--fs-xs);
  }

  &__desc {
    color: var(--c-text-subtle);
  }

  &__count {
    margin-left: auto;
    color: var(--c-text-subtle);
    font-variant-numeric: tabular-nums;
  }

  &--error {
    .field__control {
      border-color: var(--c-danger);
    }

    .field__desc {
      color: var(--c-danger);
    }
  }
}
</style>

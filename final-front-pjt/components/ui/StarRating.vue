<script setup lang="ts">
/**
 * 0~5 별점. readonly 가 아니면 클릭/키보드로 값을 선택할 수 있다.
 * (숫자를 직접 입력하고 isNaN 으로 검증하던 기존 방식을 대체)
 */
const model = defineModel<number>({ default: 0 })

const props = withDefaults(defineProps<{
  readonly?: boolean
  size?: number
  max?: number
}>(), {
  readonly: false,
  size: 18,
  max: 5,
})

const hovered = ref<number | null>(null)
const display = computed(() => hovered.value ?? model.value)
const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

function select(value: number) {
  if (props.readonly) return
  // 같은 별을 다시 누르면 0점으로 초기화
  model.value = model.value === value ? 0 : value
}

function onKeydown(event: KeyboardEvent) {
  if (props.readonly) return
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    model.value = Math.min(props.max, model.value + 1)
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    model.value = Math.max(0, model.value - 1)
  }
}
</script>

<template>
  <div
    v-if="readonly"
    class="stars stars--readonly"
    role="img"
    :aria-label="`5점 만점에 ${model}점`"
  >
    <UiIcon
      v-for="star in stars"
      :key="star"
      name="star"
      :size="size"
      filled
      :stroke-width="0"
      :class="{ 'is-on': star <= Math.round(model) }"
    />
  </div>
  <div
    v-else
    class="stars"
    role="slider"
    tabindex="0"
    aria-label="평점"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="model"
    :aria-valuetext="`${model}점`"
    @keydown="onKeydown"
    @mouseleave="hovered = null"
  >
    <button
      v-for="star in stars"
      :key="star"
      type="button"
      tabindex="-1"
      class="stars__btn"
      :aria-label="`${star}점`"
      @mouseenter="hovered = star"
      @click="select(star)"
    >
      <UiIcon
        name="star"
        :size="size"
        filled
        :stroke-width="0"
        :class="{ 'is-on': star <= display }"
      />
    </button>
    <span class="stars__value">{{ model }}점</span>
  </div>
</template>

<style scoped lang="scss">
.stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-radius: var(--radius-sm);

  :deep(.icon) {
    color: var(--c-surface-3);
    transition:
      color var(--dur-fast) var(--ease),
      transform var(--dur-fast) var(--ease);

    &.is-on {
      color: var(--c-gold);
    }
  }

  &__btn {
    padding: 2px;

    &:hover :deep(.icon) {
      transform: scale(1.15);
    }
  }

  &__value {
    margin-left: 8px;
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-text-muted);
    font-variant-numeric: tabular-nums;
  }
}
</style>

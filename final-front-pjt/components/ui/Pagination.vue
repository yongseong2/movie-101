<script setup lang="ts">
defineProps<{
  page: number
  pages: number[]
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}>()

const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination"
    aria-label="페이지 이동"
  >
    <button
      type="button"
      class="pagination__btn"
      :disabled="!hasPrev"
      aria-label="이전 페이지"
      @click="emit('change', page - 1)"
    >
      <UiIcon
        name="chevron-left"
        :size="18"
      />
    </button>
    <button
      v-for="item in pages"
      :key="item"
      type="button"
      class="pagination__btn"
      :class="{ 'is-active': item === page }"
      :aria-current="item === page ? 'page' : undefined"
      @click="emit('change', item)"
    >
      {{ item }}
    </button>
    <button
      type="button"
      class="pagination__btn"
      :disabled="!hasNext"
      aria-label="다음 페이지"
      @click="emit('change', page + 1)"
    >
      <UiIcon
        name="chevron-right"
        :size="18"
      />
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;

  &__btn {
    display: grid;
    place-items: center;
    min-width: 38px;
    height: 38px;
    padding: 0 10px;
    border-radius: var(--radius-full);
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-text-muted);
    font-variant-numeric: tabular-nums;
    transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);

    &:hover:not(:disabled, .is-active) {
      background: rgb(255 255 255 / 0.06);
      color: var(--c-text);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &.is-active {
      background: var(--c-text);
      color: var(--c-bg);
    }
  }
}
</style>

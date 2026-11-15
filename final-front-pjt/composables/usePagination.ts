import { computed, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

interface PaginationOptions {
  pageSize?: number
  /** 외부(예: 라우트 쿼리)와 동기화할 페이지 상태. 없으면 내부 ref 를 사용한다 */
  page?: Ref<number>
  /** 페이지 버튼을 최대 몇 개까지 노출할지 */
  window?: number
}

/** 클라이언트 페이지네이션 — 목록 · 페이지 범위 · 이동 함수를 제공한다 */
export function usePagination<T>(source: MaybeRefOrGetter<readonly T[]>, options: PaginationOptions = {}) {
  const { pageSize = 10, window: windowSize = 5 } = options
  const page = options.page ?? ref(1)

  const total = computed(() => toValue(source).length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const current = computed(() => Math.min(Math.max(1, page.value), totalPages.value))

  const items = computed(() => {
    const start = (current.value - 1) * pageSize
    return toValue(source).slice(start, start + pageSize)
  })

  /** 현재 페이지를 중심으로 windowSize 개의 페이지 번호 */
  const pages = computed(() => {
    const half = Math.floor(windowSize / 2)
    const start = Math.max(1, Math.min(current.value - half, totalPages.value - windowSize + 1))
    const end = Math.min(totalPages.value, start + windowSize - 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })

  function goTo(target: number) {
    page.value = Math.min(Math.max(1, target), totalPages.value)
  }

  // 목록이 줄어 현재 페이지가 범위를 벗어나면 보정
  watch(totalPages, (count) => {
    if (page.value > count) page.value = count
  })

  return {
    page: current,
    total,
    totalPages,
    items,
    pages,
    hasPrev: computed(() => current.value > 1),
    hasNext: computed(() => current.value < totalPages.value),
    goTo,
    next: () => goTo(current.value + 1),
    prev: () => goTo(current.value - 1),
  }
}

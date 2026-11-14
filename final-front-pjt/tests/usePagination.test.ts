import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePagination } from '~/composables/usePagination'

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

describe('usePagination', () => {
  it('현재 페이지의 아이템과 전체 페이지 수를 계산한다', () => {
    const p = usePagination(range(23), { pageSize: 10 })
    expect(p.totalPages.value).toBe(3)
    expect(p.items.value).toEqual(range(10))

    p.goTo(3)
    expect(p.items.value).toEqual([21, 22, 23])
    expect(p.hasNext.value).toBe(false)
  })

  it('범위를 벗어난 페이지 이동은 경계값으로 보정한다', () => {
    const p = usePagination(range(5), { pageSize: 2 })
    p.goTo(99)
    expect(p.page.value).toBe(3)
    p.goTo(-1)
    expect(p.page.value).toBe(1)
  })

  it('현재 페이지를 중심으로 최대 window 개의 페이지 번호를 노출한다', () => {
    const page = ref(6)
    const p = usePagination(range(100), { pageSize: 10, page, window: 5 })
    expect(p.pages.value).toEqual([4, 5, 6, 7, 8])

    page.value = 10
    expect(p.pages.value).toEqual([6, 7, 8, 9, 10])

    page.value = 1
    expect(p.pages.value).toEqual([1, 2, 3, 4, 5])
  })

  it('목록이 줄어들면 현재 페이지를 마지막 페이지로 보정한다', async () => {
    const list = ref(range(30))
    const page = ref(3)
    const p = usePagination(list, { pageSize: 10, page })

    list.value = range(12)
    await nextTick()
    expect(page.value).toBe(2)
    expect(p.items.value).toEqual([11, 12])
  })

  it('빈 목록도 1페이지로 처리한다', () => {
    const p = usePagination([], { pageSize: 10 })
    expect(p.totalPages.value).toBe(1)
    expect(p.items.value).toEqual([])
    expect(p.hasPrev.value).toBe(false)
  })
})

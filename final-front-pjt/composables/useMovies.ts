import type { Ref } from 'vue'
import type { MovieCollection } from '~/repositories/tmdb'
import type { ReviewPayload } from '~/types'

/** useAsyncData 캐시 키 — 다른 컴포넌트에서 refreshNuxtData 로 갱신할 때 사용 */
export const movieDataKey = (id: number) => `movie:${id}`

export function useMovie(id: number) {
  const api = useApi()
  return useAsyncData(movieDataKey(id), () => api.movie.getMovie(id))
}

/** 현재 상영작 · 인기작 (Nitro 서버 라우트에서 캐시됨) */
export function useMovieCollection(kind: MovieCollection) {
  const api = useApi()
  return useAsyncData(`tmdb:${kind}`, () => api.tmdb.collection(kind), {
    default: () => [],
  })
}

export function useMovieSearch(query: Ref<string>) {
  const api = useApi()
  return useAsyncData('tmdb:search', () => (query.value ? api.tmdb.search(query.value) : Promise.resolve([])), {
    default: () => [],
    watch: [query],
  })
}

/** DB 에 저장된 영화 중 하나를 랜덤으로 골라 상세 페이지로 이동 */
export function useRandomMovie() {
  const api = useApi()
  return useAsyncAction(async () => {
    const movie = await api.recommendation.randomMovie()
    await navigateTo(`/movies/${movie.id}`)
  }, { errorMessage: '추천할 영화를 찾지 못했어요.' })
}

/** 한줄평 작성 · 수정 · 삭제 */
export function useReviewActions(movieId: number, onChange: () => Promise<unknown>) {
  const api = useApi()
  const toast = useToast()
  const { confirm } = useConfirm()

  const create = useAsyncAction(async (payload: ReviewPayload) => {
    await api.movie.createReview(movieId, payload)
    await onChange()
    toast.success('한줄평을 남겼어요.')
    return true
  }, { errorMessage: '한줄평을 등록하지 못했습니다.' })

  const update = useAsyncAction(async (reviewId: number, payload: ReviewPayload) => {
    await api.movie.updateReview(reviewId, payload)
    await onChange()
    toast.success('한줄평을 수정했어요.')
    return true
  }, { errorMessage: '한줄평을 수정하지 못했습니다.' })

  const remove = useAsyncAction(async (reviewId: number) => {
    const confirmed = await confirm({ title: '한줄평을 삭제할까요?', confirmText: '삭제', danger: true })
    if (!confirmed) return
    await api.movie.deleteReview(reviewId)
    await onChange()
    toast.success('한줄평을 삭제했어요.')
  }, { errorMessage: '한줄평을 삭제하지 못했습니다.' })

  return { create, update, remove }
}

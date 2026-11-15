import type { HttpClient } from './types'
import type { MovieDetail, MovieDetailResponse, Review, ReviewPayload } from '~/types'
import { parsePythonList } from '~/utils/parse'

/** 백엔드 응답을 화면용 모델로 정규화 (문자열로 저장된 리스트 필드 파싱) */
export function toMovieDetail({ directors, casts, video_key, ...rest }: MovieDetailResponse): MovieDetail {
  return {
    ...rest,
    directors: parsePythonList(directors),
    casts: parsePythonList(casts),
    trailerKeys: parsePythonList(video_key),
  }
}

export function createMovieRepository(api: HttpClient) {
  return {
    getMovie: async (id: number) =>
      toMovieDetail(await api<MovieDetailResponse>(`/movies/${id}/`)),

    createReview: (movieId: number, body: ReviewPayload) =>
      api<Review>(`/movies/${movieId}/review/`, { method: 'POST', body }),

    updateReview: (id: number, body: ReviewPayload) =>
      api<Review>(`/movies/reviews/${id}/`, { method: 'PUT', body }),

    deleteReview: (id: number) =>
      api(`/movies/reviews/${id}/`, { method: 'DELETE' }),
  }
}

import type { HttpClient } from './types'
import type { Actor, MovieDetailResponse, MovieSummary, RecommendedMovie } from '~/types'

/** Django `today` 앱 — 랜덤 추천 · 월드컵 후보 · 월드컵 결과 기반 추천 */
export function createRecommendationRepository(api: HttpClient) {
  return {
    randomMovie: () =>
      api<MovieDetailResponse>('/today/random/'),

    movieCandidates: () =>
      api<MovieSummary[]>('/today/movies/'),

    recommendByMovie: (movieId: number) =>
      api<RecommendedMovie>(`/today/movies/results/${movieId}/`),

    actorCandidates: () =>
      api<Actor[]>('/today/actors/'),

    recommendByActor: (actorId: number) =>
      api<RecommendedMovie>(`/today/actors/results/${actorId}/`),
  }
}

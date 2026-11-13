import type { HttpClient } from './types'
import type { MovieSummary } from '~/types'

export type MovieCollection = 'now-playing' | 'popular'

/** Nitro 서버 라우트(`/api/tmdb/*`)를 통해 TMDB를 호출한다 — API 키는 서버에만 존재 */
export function createTmdbRepository(fetcher: HttpClient) {
  return {
    collection: (kind: MovieCollection) =>
      fetcher<MovieSummary[]>(`/api/tmdb/${kind}`),

    search: (query: string) =>
      fetcher<MovieSummary[]>('/api/tmdb/search', { query: { q: query } }),
  }
}

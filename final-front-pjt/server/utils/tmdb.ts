import type { MovieSummary } from '~/types'

interface TmdbMovie {
  id: number
  title: string
  poster_path: string | null
  release_date?: string
  vote_average?: number
  adult?: boolean
}

interface TmdbPage {
  page: number
  results: TmdbMovie[]
  total_pages: number
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/** TMDB 호출 — API 키는 서버 런타임 설정(NUXT_TMDB_API_KEY)에서만 읽는다 */
export async function fetchTmdbMovies(path: string, query: Record<string, string | number> = {}) {
  const { tmdbApiKey } = useRuntimeConfig()
  if (!tmdbApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'TMDB API key is not configured (NUXT_TMDB_API_KEY)' })
  }

  const data = await $fetch<TmdbPage>(`${TMDB_BASE_URL}${path}`, {
    query: { api_key: tmdbApiKey, language: 'ko-KR', include_adult: 'false', ...query },
  })

  return data.results.filter(movie => !movie.adult).map(toMovieSummary)
}

/** 클라이언트에 필요한 필드만 내려 응답 크기를 줄인다 */
function toMovieSummary(movie: TmdbMovie): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date || null,
    vote_average: movie.vote_average ?? null,
  }
}

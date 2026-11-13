/** Django `movies.Review` */
export interface Review {
  id: number
  movie: number
  user: number
  username: string
  rate: number
  review: string | null
  created_at: string
  updated_at: string
}

export interface ReviewPayload {
  review: string
  rate: number
}

/**
 * Django `GET /movies/:id/` 원본 응답.
 * directors / casts / video_key 는 파이썬 리스트를 문자열로 저장한 값이다 (예: "['봉준호']").
 */
export interface MovieDetailResponse {
  id: number
  movie_id: number
  title: string
  overview: string | null
  poster_path: string | null
  release_date: string | null
  vote_average: number | null
  genre_ids: string | null
  genres: string[]
  directors: string | null
  casts: string | null
  video_key: string | null
  rate_avg: number
  review_count: number
  review_set: Review[]
}

/** 화면에서 사용하는 정규화된 영화 상세 모델 */
export interface MovieDetail extends Omit<MovieDetailResponse, 'directors' | 'casts' | 'video_key'> {
  directors: string[]
  casts: string[]
  trailerKeys: string[]
}

/** 목록/카드에서 사용하는 최소 영화 정보 (TMDB 프록시 · 월드컵 후보 공통) */
export interface MovieSummary {
  id: number
  title: string
  poster_path: string | null
  release_date?: string | null
  vote_average?: number | null
}

/** 추천 결과 (`/today/.../results/:id/`) */
export interface RecommendedMovie {
  title: string
  overview: string
  poster_path: string | null
}

import type { HttpClient } from './types'
import { createAuthRepository } from './auth'
import { createCommunityRepository } from './community'
import { createMovieRepository } from './movie'
import { createProfileRepository } from './profile'
import { createRecommendationRepository } from './recommendation'
import { createTmdbRepository } from './tmdb'

/**
 * 도메인별 API 함수를 한 곳에서 생성한다.
 * @param api   Django REST API용 fetch 인스턴스 (baseURL · 인증 헤더 적용)
 * @param local Nuxt 서버 라우트용 fetch 인스턴스
 */
export function createRepositories(api: HttpClient, local: HttpClient) {
  return {
    auth: createAuthRepository(api),
    community: createCommunityRepository(api),
    movie: createMovieRepository(api),
    profile: createProfileRepository(api),
    recommendation: createRecommendationRepository(api),
    tmdb: createTmdbRepository(local),
  }
}

export type Repositories = ReturnType<typeof createRepositories>

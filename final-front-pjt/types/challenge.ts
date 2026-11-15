import type { RecommendedMovie } from './movie'

/** Django `today.Actor` 목록 아이템 */
export interface Actor {
  id: number
  name: string
  img: string | null
}

export type ChallengeType = 'movie' | 'actor'

/** 월드컵 화면에서 영화·배우를 동일하게 다루기 위한 공통 후보 모델 */
export interface Candidate {
  id: number
  name: string
  image: string
  subtitle?: string
}

export interface ChallengeDefinition {
  type: ChallengeType
  title: string
  description: string
  prompt: string
  resultLabel: (winner: Candidate) => string
  fetchCandidates: () => Promise<Candidate[]>
  fetchRecommendation: (winnerId: number) => Promise<RecommendedMovie>
}

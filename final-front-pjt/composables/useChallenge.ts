import type { ChallengeDefinition, ChallengeType } from '~/types'

/**
 * 영화 월드컵 / 배우 월드컵의 차이(후보 API · 결과 API · 이미지 경로 · 문구)만 정의한다.
 * 나머지 진행 로직은 useTournament 하나를 공유한다.
 */
export function useChallengeDefinition(type: ChallengeType): ChallengeDefinition {
  const api = useApi()
  const mediaUrl = useMediaUrl()

  const definitions: Record<ChallengeType, ChallengeDefinition> = {
    movie: {
      type: 'movie',
      title: '영화 월드컵',
      description: '32편의 영화 중 끝까지 살아남은 한 편으로 비슷한 명작을 추천해드려요.',
      prompt: '더 끌리는 영화를 골라주세요',
      resultLabel: winner => `「${winner.name}」을(를) 좋아한다면`,
      fetchCandidates: async () => {
        const movies = await api.recommendation.movieCandidates()
        return movies.map(movie => ({ id: movie.id, name: movie.title, image: tmdbImage(movie.poster_path, 'w500') }))
      },
      fetchRecommendation: id => api.recommendation.recommendByMovie(id),
    },
    actor: {
      type: 'actor',
      title: '배우 월드컵',
      description: '32명의 배우 중 최애 배우를 고르면 그 배우의 출연작을 추천해드려요.',
      prompt: '더 좋아하는 배우를 골라주세요',
      resultLabel: winner => `${winner.name} 배우의 추천 출연작`,
      fetchCandidates: async () => {
        const actors = await api.recommendation.actorCandidates()
        return actors.map(actor => ({ id: actor.id, name: actor.name, image: mediaUrl(actor.img) }))
      },
      fetchRecommendation: id => api.recommendation.recommendByActor(id),
    },
  }

  return definitions[type]
}

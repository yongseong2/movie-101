import type { ChallengeType } from '~/types'

export const CHALLENGE_TYPES = ['movie', 'actor'] as const satisfies readonly ChallengeType[]

export function isChallengeType(value: unknown): value is ChallengeType {
  return typeof value === 'string' && (CHALLENGE_TYPES as readonly string[]).includes(value)
}

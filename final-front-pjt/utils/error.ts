import { FetchError } from 'ofetch'

const KNOWN_MESSAGES: Array<[RegExp, string]> = [
  [/already exists/i, '이미 사용 중인 아이디입니다.'],
  [/unable to log in/i, '아이디 또는 비밀번호가 올바르지 않습니다.'],
  [/password fields didn.t match|two password fields/i, '비밀번호가 서로 일치하지 않습니다.'],
  [/too short/i, '비밀번호는 8자 이상이어야 합니다.'],
  [/too common/i, '너무 흔한 비밀번호입니다.'],
  [/entirely numeric/i, '비밀번호는 숫자로만 구성할 수 없습니다.'],
  [/too similar/i, '아이디와 너무 비슷한 비밀번호입니다.'],
  [/may not be blank|this field is required/i, '필수 항목을 입력해주세요.'],
]

export function getStatusCode(error: unknown): number | undefined {
  if (error instanceof FetchError) return error.statusCode ?? error.response?.status
  if (error && typeof error === 'object' && 'statusCode' in error) return Number(error.statusCode)
  return undefined
}

export const isNotFound = (error: unknown) => getStatusCode(error) === 404

/** DRF 에러 응답({ field: ['message'] })에서 첫 번째 메시지를 추출해 한국어로 변환한다 */
export function getErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'): string {
  const data = error instanceof FetchError ? error.data : undefined
  const first = extractFirstMessage(data)
  if (!first) return fallback
  return KNOWN_MESSAGES.find(([pattern]) => pattern.test(first))?.[1] ?? first
}

function extractFirstMessage(data: unknown): string | undefined {
  if (!data) return undefined
  if (typeof data === 'string') return data.length < 200 ? data : undefined
  if (Array.isArray(data)) return extractFirstMessage(data[0])
  if (typeof data === 'object') {
    for (const value of Object.values(data as Record<string, unknown>)) {
      const message = extractFirstMessage(value)
      if (message) return message
    }
  }
  return undefined
}

const pad = (value: number) => String(value).padStart(2, '0')

function toDate(input: string | Date | null | undefined): Date | null {
  if (!input) return null
  const date = input instanceof Date ? input : new Date(input)
  return Number.isNaN(date.getTime()) ? null : date
}

/** 2024.05.22 */
export function formatDate(input: string | Date | null | undefined): string {
  const date = toDate(input)
  if (!date) return ''
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

/** 2024.05.22 13:05 */
export function formatDateTime(input: string | Date | null | undefined): string {
  const date = toDate(input)
  if (!date) return ''
  return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** 2024 */
export function formatYear(input: string | Date | null | undefined): string {
  const date = toDate(input)
  return date ? String(date.getFullYear()) : ''
}

/**
 * 방금 전 / 5분 전 / 3시간 전 / 2일 전 / 2024.05.22
 * 일주일이 지난 날짜는 절대 날짜로 표기한다.
 */
export function formatRelativeTime(input: string | Date | null | undefined, now: Date = new Date()): string {
  const date = toDate(input)
  if (!date) return ''
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffSec < 60) return '방금 전'
  if (diffSec < 60 * 60) return `${Math.floor(diffSec / 60)}분 전`
  if (diffSec < 60 * 60 * 24) return `${Math.floor(diffSec / 3600)}시간 전`
  if (diffSec < 60 * 60 * 24 * 7) return `${Math.floor(diffSec / 86400)}일 전`
  return formatDate(date)
}

/** 평점 숫자를 소수점 한 자리로 */
export function formatRating(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '-'
  return value.toFixed(1)
}

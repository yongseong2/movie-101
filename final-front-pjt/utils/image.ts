export const FALLBACK_POSTER = '/images/no-poster.jpg'
export const FALLBACK_AVATAR = '/images/default-profile.png'

export type TmdbImageSize = 'w185' | 'w342' | 'w500' | 'w780' | 'original'

/** TMDB 포스터 경로를 CDN URL로 변환 (원본 대신 용도에 맞는 사이즈를 사용해 전송량을 줄인다) */
export function tmdbImage(path: string | null | undefined, size: TmdbImageSize = 'w500'): string {
  if (!path) return FALLBACK_POSTER
  return `https://image.tmdb.org/t/p/${size}${path}`
}

/**
 * Django 미디어 경로를 절대 URL로 변환한다.
 * 백엔드는 `/media/...` 형태와 `/actors/...`(MEDIA_URL 미포함) 형태를 섞어서 내려주므로 둘 다 처리한다.
 */
export function resolveMediaUrl(path: string | null | undefined, apiBase: string, fallback = FALLBACK_POSTER): string {
  if (!path) return fallback
  if (/^https?:\/\//.test(path)) return path
  const normalized = path.startsWith('/media/') ? path : `/media${path.startsWith('/') ? '' : '/'}${path}`
  return `${apiBase.replace(/\/$/, '')}${normalized}`
}

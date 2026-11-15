import { FetchError } from 'ofetch'
import { describe, expect, it } from 'vitest'
import { toMovieDetail } from '~/repositories/movie'
import { getErrorMessage, isNotFound } from '~/utils/error'
import { formatDate, formatDateTime, formatRating, formatRelativeTime, formatYear } from '~/utils/format'
import { FALLBACK_POSTER, resolveMediaUrl, tmdbImage } from '~/utils/image'
import { parsePythonList } from '~/utils/parse'
import type { MovieDetailResponse } from '~/types'

describe('parsePythonList', () => {
  it('파이썬 리스트 문자열을 배열로 변환한다', () => {
    expect(parsePythonList('[\'봉준호\', \'박찬욱\']')).toEqual(['봉준호', '박찬욱'])
  })

  it('작은따옴표가 포함된 값(큰따옴표로 감싼 값)도 처리한다', () => {
    expect(parsePythonList('["Conan O\'Brien", \'Tom Hanks\']')).toEqual(['Conan O\'Brien', 'Tom Hanks'])
  })

  it('빈 값은 빈 배열을 반환한다', () => {
    expect(parsePythonList(null)).toEqual([])
    expect(parsePythonList('[]')).toEqual([])
  })
})

describe('toMovieDetail', () => {
  it('문자열로 저장된 감독 · 출연진 · 예고편 키를 배열로 정규화한다', () => {
    const raw = {
      id: 1,
      directors: '[\'봉준호\']',
      casts: '[\'송강호\', \'이선균\']',
      video_key: '[\'abc123\']',
    } as MovieDetailResponse

    const movie = toMovieDetail(raw)
    expect(movie.directors).toEqual(['봉준호'])
    expect(movie.casts).toEqual(['송강호', '이선균'])
    expect(movie.trailerKeys).toEqual(['abc123'])
    expect(movie).not.toHaveProperty('video_key')
  })
})

describe('format', () => {
  const date = new Date(2024, 4, 2, 9, 5)

  it('날짜를 포맷한다', () => {
    expect(formatDate(date)).toBe('2024.05.02')
    expect(formatDateTime(date)).toBe('2024.05.02 09:05')
    expect(formatYear('2019-05-30')).toBe('2019')
    expect(formatDate('invalid')).toBe('')
  })

  it('상대 시간을 표시한다', () => {
    const now = new Date(2024, 4, 10, 12, 0)
    expect(formatRelativeTime(new Date(2024, 4, 10, 11, 59, 30), now)).toBe('방금 전')
    expect(formatRelativeTime(new Date(2024, 4, 10, 11, 30), now)).toBe('30분 전')
    expect(formatRelativeTime(new Date(2024, 4, 10, 9, 0), now)).toBe('3시간 전')
    expect(formatRelativeTime(new Date(2024, 4, 8, 12, 0), now)).toBe('2일 전')
    expect(formatRelativeTime(new Date(2024, 3, 1), now)).toBe('2024.04.01')
  })

  it('평점을 소수점 한 자리로 표시한다', () => {
    expect(formatRating(8.456)).toBe('8.5')
    expect(formatRating(null)).toBe('-')
  })
})

describe('image', () => {
  it('TMDB 이미지 URL 을 사이즈별로 만든다', () => {
    expect(tmdbImage('/abc.jpg', 'w342')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg')
    expect(tmdbImage(null)).toBe(FALLBACK_POSTER)
  })

  it('Django 미디어 경로를 절대 URL 로 만든다', () => {
    const base = 'http://127.0.0.1:8000/'
    expect(resolveMediaUrl('/media/profile_img/a.png', base)).toBe('http://127.0.0.1:8000/media/profile_img/a.png')
    expect(resolveMediaUrl('/actors/송강호.jpg', base)).toBe('http://127.0.0.1:8000/media/actors/송강호.jpg')
    expect(resolveMediaUrl('https://cdn.example.com/a.png', base)).toBe('https://cdn.example.com/a.png')
    expect(resolveMediaUrl(null, base, '/fallback.png')).toBe('/fallback.png')
  })
})

describe('error', () => {
  const fetchError = (status: number, data: unknown) => {
    const error = new FetchError('request failed')
    error.statusCode = status
    error.data = data
    return error
  }

  it('DRF 에러 응답의 첫 메시지를 한국어로 변환한다', () => {
    expect(getErrorMessage(fetchError(400, { username: ['A user with that username already exists.'] })))
      .toBe('이미 사용 중인 아이디입니다.')
    expect(getErrorMessage(fetchError(400, { non_field_errors: ['Unable to log in with provided credentials.'] })))
      .toBe('아이디 또는 비밀번호가 올바르지 않습니다.')
    expect(getErrorMessage(fetchError(400, { new_password2: ['This password is too short.'] })))
      .toBe('비밀번호는 8자 이상이어야 합니다.')
  })

  it('해석할 수 없으면 기본 메시지를 반환한다', () => {
    expect(getErrorMessage(new Error('boom'), '기본')).toBe('기본')
    expect(getErrorMessage(fetchError(500, '<html>...'.repeat(50)), '기본')).toBe('기본')
  })

  it('404 여부를 판별한다', () => {
    expect(isNotFound(fetchError(404, null))).toBe(true)
    expect(isNotFound(fetchError(500, null))).toBe(false)
  })
})

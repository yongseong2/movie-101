/**
 * Django 모델에 문자열로 저장된 파이썬 리스트를 배열로 변환한다.
 *
 * @example parsePythonList("['봉준호', \"O'Brien\"]") // ['봉준호', "O'Brien"]
 */
export function parsePythonList(raw: string | null | undefined): string[] {
  if (!raw) return []
  const matches = raw.matchAll(/'([^']*)'|"([^"]*)"/g)
  return Array.from(matches, ([, single, double]) => (single ?? double ?? '').trim()).filter(Boolean)
}

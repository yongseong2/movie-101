/** GET /api/tmdb/search?q=기생충 — 동일 검색어는 5분간 서버 캐시 */
export default defineCachedEventHandler(async (event) => {
  const q = String(getQuery(event).q ?? '').trim()
  if (!q) return []
  return fetchTmdbMovies('/search/movie', { query: q, page: 1 })
}, {
  name: 'tmdb-search',
  maxAge: 60 * 5,
  getKey: event => String(getQuery(event).q ?? '').trim().toLowerCase(),
})

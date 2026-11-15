const COLLECTION_PATHS = {
  'now-playing': '/movie/now_playing',
  'popular': '/movie/popular',
} as const

type Collection = keyof typeof COLLECTION_PATHS

const isCollection = (value: string | undefined): value is Collection =>
  !!value && value in COLLECTION_PATHS

/** GET /api/tmdb/now-playing | /api/tmdb/popular — 10분간 서버 캐시 */
export default defineCachedEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  if (!isCollection(collection)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown collection' })
  }
  return fetchTmdbMovies(COLLECTION_PATHS[collection], { page: 1, region: 'KR' })
}, {
  name: 'tmdb-collection',
  maxAge: 60 * 10,
  getKey: event => getRouterParam(event, 'collection') ?? 'unknown',
})

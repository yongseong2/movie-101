import { createRepositories } from '~/repositories'

/**
 * Django REST API 클라이언트.
 * - baseURL 은 runtimeConfig 로 관리
 * - 모든 요청에 토큰 헤더를 자동으로 주입 (컴포넌트마다 반복되던 Authorization 헤더 제거)
 * - 만료/무효 토큰(401)은 세션을 정리하고 로그인 페이지로 이동
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (auth.token) {
        options.headers.set('Authorization', `Token ${auth.token}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && auth.token) {
        auth.clearSession()
        await nuxtApp.runWithContext(() => navigateTo({ path: '/login', query: { expired: '1' } }))
      }
    },
  })

  // Nuxt 서버 라우트(/api/*) 호출용 — 같은 오리진이므로 baseURL · 인증 헤더가 필요 없다
  const local = $fetch.create({})

  return {
    provide: {
      api: createRepositories(api, local),
    },
  }
})

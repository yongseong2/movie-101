/**
 * 페이지별 definePageMeta({ requiresAuth | guestOnly }) 를 기반으로 접근을 제어한다.
 * (Vue 2 시절 라우트 이름 배열을 하드코딩하던 beforeEach 가드를 대체)
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    useToast().info('로그인이 필요한 서비스입니다.')
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return navigateTo('/')
  }
})

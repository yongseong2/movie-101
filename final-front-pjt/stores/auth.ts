const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 14일

/**
 * 인증 상태 스토어 (Vuex + vuex-persistedstate → Pinia + useCookie)
 *
 * localStorage 대신 쿠키에 세션을 저장해 SSR 단계에서도 로그인 상태를 알 수 있다.
 * 로그인/로그아웃 같은 "흐름"은 useAuth 컴포저블이 담당하고, 스토어는 상태만 관리한다.
 */
export const useAuthStore = defineStore('auth', () => {
  const cookieOptions = { maxAge: SESSION_MAX_AGE, sameSite: 'lax', path: '/' } as const

  const token = useCookie<string | null>('m101_token', { ...cookieOptions, default: () => null })
  const username = useCookie<string | null>('m101_user', { ...cookieOptions, default: () => null })

  const isLoggedIn = computed(() => Boolean(token.value))

  function setSession(newToken: string, newUsername: string) {
    token.value = newToken
    username.value = newUsername
  }

  function clearSession() {
    token.value = null
    username.value = null
  }

  /** 작성자가 현재 로그인한 사용자인지 (댓글·리뷰마다 is_mine 을 묻던 N+1 요청 제거) */
  function isMe(name: string | null | undefined) {
    return Boolean(name) && name === username.value
  }

  return { token, username, isLoggedIn, setSession, clearSession, isMe }
})

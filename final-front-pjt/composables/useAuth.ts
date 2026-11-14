import type { LoginPayload, PasswordChangePayload, SignUpPayload } from '~/types'

/** 외부 URL 로의 오픈 리다이렉트를 막고 내부 경로만 허용한다 */
function safeRedirect(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

/**
 * 로그인 · 회원가입 · 로그아웃 · 비밀번호 변경 흐름.
 * 상태는 useAuthStore, API 는 레포지토리, 피드백은 토스트로 분리했다.
 */
export function useAuth() {
  const api = useApi()
  const auth = useAuthStore()
  const toast = useToast()
  const route = useRoute()

  const login = useAsyncAction(async (payload: LoginPayload) => {
    const { key } = await api.auth.login(payload)
    auth.setSession(key, payload.username)
    toast.success(`${payload.username}님, 환영합니다!`)
    await navigateTo(safeRedirect(route.query.redirect), { replace: true })
  }, { errorMessage: '아이디 또는 비밀번호가 올바르지 않습니다.' })

  const signUp = useAsyncAction(async (payload: SignUpPayload) => {
    const { key } = await api.auth.signUp(payload)
    auth.setSession(key, payload.username)
    toast.success('회원가입이 완료되었습니다. MOVIE 101 에 오신 걸 환영해요!')
    await navigateTo('/', { replace: true })
  }, { errorMessage: '회원가입에 실패했습니다.' })

  async function endSession(message: string, redirect = '/') {
    try {
      await api.auth.logout()
    }
    catch {
      // 서버 세션 정리에 실패해도 클라이언트 세션은 정리한다
    }
    auth.clearSession()
    clearNuxtData()
    toast.info(message)
    await navigateTo(redirect)
  }

  const logout = useAsyncAction(() => endSession('로그아웃 되었습니다.'))

  const changePassword = useAsyncAction(async (payload: PasswordChangePayload) => {
    await api.auth.changePassword(payload)
    await endSession('비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해주세요.', '/login')
  }, { errorMessage: '비밀번호를 변경하지 못했습니다.' })

  return { login, signUp, logout, changePassword }
}

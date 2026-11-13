import type { HttpClient } from './types'
import type { AuthTokenResponse, LoginPayload, PasswordChangePayload, SignUpPayload } from '~/types'

export function createAuthRepository(api: HttpClient) {
  return {
    login: (body: LoginPayload) =>
      api<AuthTokenResponse>('/accounts/login/', { method: 'POST', body }),

    signUp: (body: SignUpPayload) =>
      api<AuthTokenResponse>('/accounts/signup/', { method: 'POST', body }),

    logout: () =>
      api('/accounts/logout/', { method: 'POST' }),

    changePassword: (body: PasswordChangePayload) =>
      api('/accounts/password/change/', { method: 'POST', body }),
  }
}

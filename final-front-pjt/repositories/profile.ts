import type { HttpClient } from './types'
import type { Profile } from '~/types'

export function createProfileRepository(api: HttpClient) {
  return {
    getProfile: (username: string) =>
      api<Profile>(`/accounts/user/${encodeURIComponent(username)}/`),

    updateProfileImage(username: string, file: File) {
      const body = new FormData()
      body.append('img', file)
      return api<Profile>(`/accounts/user/${encodeURIComponent(username)}/`, { method: 'PUT', body })
    },
  }
}

import type { ArticleDetail, Comment } from './community'
import type { Review } from './movie'

/** `GET /accounts/user/:username/` */
export interface Profile {
  username: string
  date_joined: string
  img: string | null
  background_img: string | null
  articles: ArticleDetail[]
  articles_count: number
  comments: Comment[]
  comments_count: number
  reviews: Review[]
  reviews_count: number
  is_mine: boolean
}

export interface LoginPayload {
  username: string
  password: string
}

export interface SignUpPayload {
  username: string
  password1: string
  password2: string
}

export interface PasswordChangePayload {
  new_password1: string
  new_password2: string
}

/** dj-rest-auth 토큰 응답 */
export interface AuthTokenResponse {
  key: string
}

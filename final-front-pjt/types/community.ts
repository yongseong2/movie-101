/** Django `community.Comment` */
export interface Comment {
  id: number
  article: number
  user: number
  username: string
  content: string
  created_at: string
  updated_at: string
}

/** `GET /community/` 목록 아이템 */
export interface ArticleSummary {
  id: number
  user: number
  username: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

/** `GET /community/:id/` 상세 */
export interface ArticleDetail extends ArticleSummary {
  comment_set: Comment[]
  comment_count: number
  is_mine: boolean
}

export interface ArticlePayload {
  title: string
  content: string
}

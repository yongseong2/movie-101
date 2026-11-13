import type { HttpClient } from './types'
import type { ArticleDetail, ArticlePayload, ArticleSummary, Comment } from '~/types'
import { isNotFound } from '~/utils/error'

export function createCommunityRepository(api: HttpClient) {
  return {
    /** 게시글이 하나도 없으면 백엔드가 404를 반환하므로 빈 배열로 처리한다 */
    async listArticles(): Promise<ArticleSummary[]> {
      try {
        return await api<ArticleSummary[]>('/community/')
      }
      catch (error) {
        if (isNotFound(error)) return []
        throw error
      }
    },

    getArticle: (id: number) =>
      api<ArticleDetail>(`/community/${id}/`),

    createArticle: (body: ArticlePayload) =>
      api<ArticleDetail>('/community/', { method: 'POST', body }),

    updateArticle: (id: number, body: ArticlePayload) =>
      api<ArticleDetail>(`/community/${id}/`, { method: 'PUT', body }),

    deleteArticle: (id: number) =>
      api(`/community/${id}/`, { method: 'DELETE' }),

    createComment: (articleId: number, content: string) =>
      api<Comment>(`/community/${articleId}/comments/`, { method: 'POST', body: { content } }),

    updateComment: (id: number, content: string) =>
      api<Comment>(`/community/comments/${id}/`, { method: 'PUT', body: { content } }),

    deleteComment: (id: number) =>
      api(`/community/comments/${id}/`, { method: 'DELETE' }),
  }
}

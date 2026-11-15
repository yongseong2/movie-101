import type { ArticlePayload } from '~/types'

export function useArticleList() {
  const api = useApi()
  return useAsyncData('community:articles', () => api.community.listArticles(), {
    default: () => [],
  })
}

/** useAsyncData 캐시 키 — 댓글 변경 후 refreshNuxtData 로 상세 데이터를 갱신할 때 사용 */
export const articleDataKey = (id: number) => `community:article:${id}`

export function useArticle(id: number) {
  const api = useApi()
  return useAsyncData(articleDataKey(id), () => api.community.getArticle(id))
}

/** 게시글 작성 · 수정 · 삭제 */
export function useArticleActions() {
  const api = useApi()
  const toast = useToast()
  const { confirm } = useConfirm()

  const create = useAsyncAction(async (payload: ArticlePayload) => {
    const article = await api.community.createArticle(payload)
    toast.success('게시글을 등록했어요.')
    await navigateTo(`/community/${article.id}`, { replace: true })
  }, { errorMessage: '게시글을 등록하지 못했습니다.' })

  const update = useAsyncAction(async (id: number, payload: ArticlePayload) => {
    await api.community.updateArticle(id, payload)
    toast.success('게시글을 수정했어요.')
    await navigateTo(`/community/${id}`, { replace: true })
  }, { errorMessage: '게시글을 수정하지 못했습니다.' })

  const remove = useAsyncAction(async (id: number) => {
    const confirmed = await confirm({
      title: '게시글을 삭제할까요?',
      message: '삭제한 게시글과 댓글은 복구할 수 없어요.',
      confirmText: '삭제',
      danger: true,
    })
    if (!confirmed) return
    await api.community.deleteArticle(id)
    toast.success('게시글을 삭제했어요.')
    await navigateTo('/community', { replace: true })
  }, { errorMessage: '게시글을 삭제하지 못했습니다.' })

  return { create, update, remove }
}

/** 댓글 작성 · 수정 · 삭제 — 변경 후 onChange 로 상세 데이터를 다시 불러온다 */
export function useCommentActions(articleId: number, onChange: () => Promise<unknown>) {
  const api = useApi()
  const toast = useToast()
  const { confirm } = useConfirm()

  const create = useAsyncAction(async (content: string) => {
    await api.community.createComment(articleId, content)
    await onChange()
    return true
  }, { errorMessage: '댓글을 등록하지 못했습니다.' })

  const update = useAsyncAction(async (commentId: number, content: string) => {
    await api.community.updateComment(commentId, content)
    await onChange()
    return true
  }, { errorMessage: '댓글을 수정하지 못했습니다.' })

  const remove = useAsyncAction(async (commentId: number) => {
    const confirmed = await confirm({ title: '댓글을 삭제할까요?', confirmText: '삭제', danger: true })
    if (!confirmed) return
    await api.community.deleteComment(commentId)
    await onChange()
    toast.success('댓글을 삭제했어요.')
  }, { errorMessage: '댓글을 삭제하지 못했습니다.' })

  return { create, update, remove }
}

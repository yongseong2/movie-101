interface AsyncActionOptions {
  /** 서버 메시지를 해석하지 못했을 때 보여줄 기본 에러 문구 */
  errorMessage?: string
  /** true 면 에러 토스트를 띄우지 않는다 */
  silent?: boolean
}

/**
 * 비동기 액션(폼 제출·삭제 등)의 공통 처리를 캡슐화한다.
 * - pending 상태 제공 및 중복 실행 방지
 * - 에러를 잡아 사용자 친화적인 토스트로 노출
 *
 * 성공 시 액션의 반환값을, 실패 시 undefined 를 돌려준다.
 */
export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
  options: AsyncActionOptions = {},
) {
  const pending = ref(false)
  const error = shallowRef<unknown>(null)
  const toast = useToast()

  async function run(...args: Args): Promise<Result | undefined> {
    if (pending.value) return undefined
    pending.value = true
    error.value = null
    try {
      return await action(...args)
    }
    catch (caught) {
      error.value = caught
      if (!options.silent) toast.error(getErrorMessage(caught, options.errorMessage))
      return undefined
    }
    finally {
      pending.value = false
    }
  }

  return { run, pending: readonly(pending), error: readonly(error) }
}

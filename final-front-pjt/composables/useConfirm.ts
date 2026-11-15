export interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

// resolver 는 직렬화할 수 없으므로 상태(useState)와 분리해 클라이언트 메모리에만 둔다
let resolver: ((confirmed: boolean) => void) | null = null

/**
 * Promise 기반 확인 다이얼로그.
 * @example if (await confirm({ title: '삭제할까요?', danger: true })) remove()
 */
export function useConfirm() {
  const dialog = useState<ConfirmOptions | null>('confirm-dialog', () => null)

  function confirm(options: ConfirmOptions): Promise<boolean> {
    resolver?.(false)
    dialog.value = options
    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function settle(confirmed: boolean) {
    resolver?.(confirmed)
    resolver = null
    dialog.value = null
  }

  return { dialog: readonly(dialog), confirm, settle }
}

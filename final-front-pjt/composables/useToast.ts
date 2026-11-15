export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

let seed = 0

/** alert() 를 대체하는 전역 토스트 알림 */
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  function push(type: ToastType, message: string, duration = 3200) {
    const id = ++seed
    toasts.value = [...toasts.value.slice(-3), { id, type, message }]
    if (import.meta.client) {
      window.setTimeout(() => dismiss(id), duration)
    }
    return id
  }

  return {
    toasts: readonly(toasts),
    dismiss,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message, 4500),
    info: (message: string) => push('info', message),
  }
}

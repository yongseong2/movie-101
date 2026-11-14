/** Django 미디어 경로 → 절대 URL 변환 함수 (runtimeConfig.public.apiBase 기준) */
export function useMediaUrl() {
  const { public: { apiBase } } = useRuntimeConfig()
  return (path: string | null | undefined, fallback?: string) => resolveMediaUrl(path, apiBase, fallback)
}

/** Nuxt 의 $fetch(.create) 인스턴스 타입 — 레포지토리는 구체적인 HTTP 구현이 아닌 이 타입에만 의존한다 */
export type HttpClient = typeof globalThis.$fetch

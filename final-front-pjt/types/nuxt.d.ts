declare module '#app' {
  interface PageMeta {
    /** 로그인한 사용자만 접근 가능한 페이지 */
    requiresAuth?: boolean
    /** 로그인하지 않은 사용자만 접근 가능한 페이지 (로그인 · 회원가입) */
    guestOnly?: boolean
  }
}

export {}

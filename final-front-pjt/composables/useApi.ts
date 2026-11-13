/** 도메인별 레포지토리에 접근하는 단일 진입점 */
export const useApi = () => useNuxtApp().$api

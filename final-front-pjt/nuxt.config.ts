// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@pinia/nuxt'],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'MOVIE 101',
      titleTemplate: '%s · MOVIE 101',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '32강 영화·배우 월드컵으로 취향을 찾고, 리뷰와 토론으로 영화를 나누는 MOVIE 101' },
        { name: 'theme-color', content: '#0b0b10' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/styles/main.scss'],

  runtimeConfig: {
    // 서버 전용 — TMDB API 키는 브라우저 번들에 노출되지 않고 Nitro 서버 라우트에서만 사용한다
    tmdbApiKey: '',
    public: {
      // Django REST API 주소 (NUXT_PUBLIC_API_BASE 로 덮어쓰기)
      apiBase: 'http://127.0.0.1:8000',
    },
  },

  // Vue 2 시절 URL 호환을 위한 리다이렉트
  routeRules: {
    '/moviechallenge': { redirect: '/challenge/movie' },
    '/actorchallenge': { redirect: '/challenge/actor' },
    '/create': { redirect: '/community/new' },
    '/movie/**': { redirect: '/movies/**' },
  },
  compatibilityDate: '2025-07-15',

  // 디자인 토큰(믹스인·브레이크포인트)을 모든 SFC <style lang="scss">에서 사용할 수 있도록 주입
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/tools" as *;\n',
        },
      },
    },
  },

  typescript: {
    strict: true,
  },
})

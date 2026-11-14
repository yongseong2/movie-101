import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// 순수 로직(utils · 프레임워크 비의존 composable)을 대상으로 한 단위 테스트 설정
export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})

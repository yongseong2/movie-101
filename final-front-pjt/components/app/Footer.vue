<template>
  <footer class="footer">
    <div class="footer__inner container">
      <AppLogo />
      <p class="footer__desc">
        영화 데이터 제공 · TMDB. 이 서비스는 TMDB API 를 사용하지만 TMDB 의 보증을 받지 않습니다.
      </p>
      <p class="footer__copy">
        © {{ new Date().getFullYear() }} MOVIE 101
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  border-top: 1px solid var(--c-border);
  background: var(--c-bg-elevated);

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 24px;
    padding-block: 32px;
  }

  &__desc,
  &__copy {
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  &__copy {
    margin-left: auto;
  }
}
</style>

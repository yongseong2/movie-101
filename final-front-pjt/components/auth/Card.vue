<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="auth">
    <div
      class="auth__glow"
      aria-hidden="true"
    />
    <section class="auth__card">
      <NuxtLink
        to="/"
        class="auth__logo"
        aria-label="MOVIE 101 홈"
      >
        <AppLogo />
      </NuxtLink>
      <h1 class="auth__title">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="auth__desc"
      >
        {{ description }}
      </p>
      <div
        v-if="$slots.notice"
        class="auth__notice"
        role="status"
      >
        <UiIcon
          name="info"
          :size="16"
        />
        <slot name="notice" />
      </div>
      <div class="auth__body">
        <slot />
      </div>
      <footer
        v-if="$slots.footer"
        class="auth__footer"
      >
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<style scoped lang="scss">
.auth {
  position: relative;
  display: grid;
  place-items: center;
  min-height: calc(100dvh - var(--header-h) - 120px);
  padding: 48px var(--gutter);
  overflow: hidden;
  isolation: isolate;

  &__glow {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    width: 720px;
    height: 720px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 35% 40%, rgb(255 77 109 / 0.22), transparent 55%),
      radial-gradient(circle at 70% 65%, rgb(255 200 87 / 0.14), transparent 55%);
    filter: blur(20px);
    transform: translate(-50%, -50%);
  }

  &__card {
    width: 100%;
    max-width: 420px;
    padding: clamp(28px, 6vw, 44px);
    background: rgb(22 22 31 / 0.85);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(12px);
  }

  &__logo {
    display: inline-block;
    margin-bottom: 28px;
  }

  &__title {
    font-size: var(--fs-2xl);
  }

  &__desc {
    margin-top: 6px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__notice {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    background: rgb(106 168 255 / 0.12);
    color: #b9d4ff;
    font-size: var(--fs-sm);
  }

  &__body {
    margin-top: 28px;
  }

  &__footer {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--c-border);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
    text-align: center;

    :deep(a) {
      margin-left: 4px;
      font-weight: 700;
      color: var(--c-accent);
    }
  }
}
</style>

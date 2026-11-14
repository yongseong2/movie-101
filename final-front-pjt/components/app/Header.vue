<script setup lang="ts">
const auth = useAuthStore()
const { logout } = useAuth()
const route = useRoute()

const NAV_ITEMS = [
  { to: '/movies', label: '영화' },
  { to: '/challenge/movie', label: '영화 월드컵' },
  { to: '/challenge/actor', label: '배우 월드컵' },
  { to: '/community', label: '커뮤니티' },
] as const

// ---- 검색 ----
const keyword = ref(typeof route.query.q === 'string' ? route.query.q : '')
watch(() => route.query.q, (q) => {
  keyword.value = typeof q === 'string' ? q : ''
})

function submitSearch() {
  const q = keyword.value.trim()
  if (!q) return
  menuOpen.value = false
  navigateTo({ path: '/search', query: { q } })
}

// ---- 계정 메뉴 · 모바일 메뉴 ----
const accountOpen = ref(false)
const menuOpen = ref(false)
const accountRef = ref<HTMLElement | null>(null)
useClickOutside(accountRef, () => {
  accountOpen.value = false
})

watch(() => route.fullPath, () => {
  accountOpen.value = false
  menuOpen.value = false
})

const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <NuxtLink
        to="/"
        class="header__brand"
        aria-label="MOVIE 101 홈"
      >
        <AppLogo />
      </NuxtLink>

      <nav
        class="header__nav"
        :class="{ 'is-open': menuOpen }"
        aria-label="주요 메뉴"
      >
        <NuxtLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="header__link"
          :class="{ 'is-active': isActive(item.to) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <form
        class="header__search"
        role="search"
        @submit.prevent="submitSearch"
      >
        <UiIcon
          name="search"
          :size="18"
          class="header__search-icon"
        />
        <input
          v-model="keyword"
          type="search"
          placeholder="영화 제목 검색"
          aria-label="영화 제목 검색"
          enterkeyhint="search"
        >
      </form>

      <div class="header__actions">
        <!-- 세션을 쿠키에 저장하므로 SSR 단계에서도 로그인 상태가 정확히 렌더링된다 -->
        <div
          v-if="auth.isLoggedIn && auth.username"
          ref="accountRef"
          class="account"
        >
          <button
            type="button"
            class="account__trigger"
            :aria-expanded="accountOpen"
            aria-haspopup="menu"
            @click="accountOpen = !accountOpen"
          >
            <UiAvatar
              :name="auth.username"
              :size="32"
            />
            <UiIcon
              name="chevron-down"
              :size="16"
              class="account__chevron"
            />
          </button>
          <Transition name="pop">
            <div
              v-if="accountOpen"
              class="account__menu"
              role="menu"
            >
              <p class="account__name">
                {{ auth.username }}
              </p>
              <NuxtLink
                :to="`/profile/${auth.username}`"
                class="account__item"
                role="menuitem"
              >
                <UiIcon
                  name="user"
                  :size="16"
                /> 내 프로필
              </NuxtLink>
              <NuxtLink
                to="/account/password"
                class="account__item"
                role="menuitem"
              >
                <UiIcon
                  name="lock"
                  :size="16"
                /> 비밀번호 변경
              </NuxtLink>
              <button
                type="button"
                class="account__item account__item--danger"
                role="menuitem"
                :disabled="logout.pending.value"
                @click="logout.run()"
              >
                <UiIcon
                  name="log-out"
                  :size="16"
                /> 로그아웃
              </button>
            </div>
          </Transition>
        </div>
        <template v-else>
          <UiButton
            to="/login"
            variant="ghost"
            size="sm"
          >
            로그인
          </UiButton>
          <UiButton
            to="/signup"
            size="sm"
            class="header__signup"
          >
            회원가입
          </UiButton>
        </template>

        <button
          type="button"
          class="header__menu-btn"
          :aria-expanded="menuOpen"
          aria-label="메뉴 열기"
          @click="menuOpen = !menuOpen"
        >
          <UiIcon :name="menuOpen ? 'x' : 'menu'" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  border-bottom: 1px solid var(--c-border);
  @include glass;

  &__inner {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 100%;
  }

  &__brand {
    flex-shrink: 0;
  }

  &__nav {
    display: flex;
    gap: 4px;

    @include down(lg) {
      position: absolute;
      top: var(--header-h);
      left: 0;
      right: 0;
      flex-direction: column;
      padding: 12px var(--gutter) 20px;
      border-bottom: 1px solid var(--c-border);
      background: var(--c-bg-elevated);
      visibility: hidden;
      opacity: 0;
      transform: translateY(-8px);
      transition: all var(--dur) var(--ease);

      &.is-open {
        visibility: visible;
        opacity: 1;
        transform: none;
      }
    }
  }

  &__link {
    padding: 8px 14px;
    border-radius: var(--radius-full);
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-text-muted);
    transition: color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);

    &:hover {
      color: var(--c-text);
    }

    &.is-active {
      color: var(--c-text);
      background: rgb(255 255 255 / 0.08);
    }

    @include down(lg) {
      padding: 12px 14px;
      font-size: var(--fs-md);
    }
  }

  &__search {
    position: relative;
    flex: 1;
    max-width: 320px;
    margin-left: auto;

    input {
      width: 100%;
      height: 38px;
      padding: 0 14px 0 38px;
      border: 1px solid var(--c-border);
      border-radius: var(--radius-full);
      background: rgb(255 255 255 / 0.05);
      font-size: var(--fs-sm);
      transition: all var(--dur-fast) var(--ease);

      &::placeholder {
        color: var(--c-text-subtle);
      }

      &:focus {
        outline: none;
        border-color: var(--c-accent);
        background: var(--c-bg-elevated);
        box-shadow: 0 0 0 4px var(--c-accent-soft);
      }
    }

    @include down(sm) {
      max-width: none;
    }
  }

  &__search-icon {
    position: absolute;
    top: 50%;
    left: 13px;
    color: var(--c-text-subtle);
    transform: translateY(-50%);
    pointer-events: none;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__signup {
    @include down(sm) {
      display: none;
    }
  }

  &__menu-btn {
    display: none;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;

    &:hover {
      background: rgb(255 255 255 / 0.06);
    }

    @include down(lg) {
      display: grid;
    }
  }

  @include down(sm) {
    &__inner {
      gap: 12px;
    }

    :deep(.logo__text) {
      display: none;
    }
  }
}

.account {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px 3px 3px;
    border-radius: var(--radius-full);
    transition: background-color var(--dur-fast) var(--ease);

    &:hover {
      background: rgb(255 255 255 / 0.06);
    }
  }

  &__chevron {
    color: var(--c-text-muted);
  }

  &__menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 220px;
    padding: 8px;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  &__name {
    padding: 8px 12px 10px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--c-border);
    font-weight: 700;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
    text-align: left;

    &:hover {
      background: rgb(255 255 255 / 0.06);
      color: var(--c-text);
    }

    &--danger:hover {
      color: var(--c-danger);
    }
  }
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>

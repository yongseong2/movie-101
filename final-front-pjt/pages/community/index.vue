<script setup lang="ts">
useSeoMeta({ title: '커뮤니티', description: '영화에 대한 감상과 해석을 자유롭게 나누는 MOVIE 101 토론 게시판' })

const route = useRoute()
const { data: articles, pending, error, refresh } = await useArticleList()

// ---- 검색 (제목 · 작성자) ----
const keyword = ref('')
const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return articles.value
  return articles.value.filter(article =>
    article.title.toLowerCase().includes(q) || article.username.toLowerCase().includes(q),
  )
})

// ---- 페이지네이션 (?page= 쿼리와 동기화되어 뒤로가기 · 공유 시에도 유지) ----
const page = computed({
  get: () => Math.max(1, Number(route.query.page) || 1),
  set: value => navigateTo({ query: { ...route.query, page: value > 1 ? value : undefined } }),
})
const pagination = usePagination(filtered, { pageSize: 10, page })

watch(keyword, () => {
  if (page.value !== 1) page.value = 1
})
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">
          <UiIcon
            name="message"
            :size="16"
          /> COMMUNITY
        </p>
        <h1 class="page-header__title">
          영화 토론 게시판
        </h1>
        <p class="page-header__desc">
          방금 본 영화의 감상, 숨은 디테일, 나만의 해석을 나눠보세요.
        </p>
      </div>
      <UiButton
        to="/community/new"
        icon="edit"
      >
        글쓰기
      </UiButton>
    </header>

    <div class="board surface">
      <div class="board__toolbar">
        <p class="board__count">
          전체 <strong>{{ filtered.length }}</strong>개
        </p>
        <label class="board__search">
          <UiIcon
            name="search"
            :size="16"
          />
          <input
            v-model="keyword"
            type="search"
            placeholder="제목 · 작성자 검색"
            aria-label="게시글 검색"
          >
        </label>
      </div>

      <UiEmptyState
        v-if="error"
        icon="alert"
        title="게시글을 불러오지 못했어요"
        class="board__empty"
      >
        <UiButton
          variant="secondary"
          @click="refresh()"
        >
          다시 시도
        </UiButton>
      </UiEmptyState>

      <ul
        v-else-if="pending && !articles.length"
        class="board__list"
      >
        <li
          v-for="n in 6"
          :key="n"
          class="row"
        >
          <UiSkeleton
            width="60%"
            height="18px"
          />
          <UiSkeleton
            width="30%"
            height="14px"
            style="margin-top: 8px"
          />
        </li>
      </ul>

      <UiEmptyState
        v-else-if="!filtered.length"
        :title="keyword ? '검색 결과가 없어요' : '아직 게시글이 없어요'"
        :description="keyword ? '다른 키워드로 검색해보세요.' : '첫 번째 토론을 시작해보세요!'"
        icon="message"
        class="board__empty"
      />

      <ul
        v-else
        class="board__list"
      >
        <li
          v-for="article in pagination.items.value"
          :key="article.id"
        >
          <NuxtLink
            :to="`/community/${article.id}`"
            class="row"
          >
            <span class="row__no">{{ article.id }}</span>
            <div class="row__main">
              <p class="row__title">
                {{ article.title }}
              </p>
              <p class="row__excerpt">
                {{ article.content }}
              </p>
            </div>
            <div class="row__meta">
              <UiAvatar
                :name="article.username"
                :size="24"
              />
              <span class="row__author">{{ article.username }}</span>
              <time
                :datetime="article.created_at"
                :title="formatDateTime(article.created_at)"
              >
                {{ formatRelativeTime(article.created_at) }}
              </time>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <UiPagination
      class="pagination"
      :page="pagination.page.value"
      :pages="pagination.pages.value"
      :total-pages="pagination.totalPages.value"
      :has-prev="pagination.hasPrev.value"
      :has-next="pagination.hasNext.value"
      @change="pagination.goTo"
    />
  </div>
</template>

<style scoped lang="scss">
.board {
  overflow: hidden;

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--c-border);
  }

  &__count {
    font-size: var(--fs-sm);
    color: var(--c-text-muted);

    strong {
      color: var(--c-text);
    }
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 14px;
    border: 1px solid var(--c-border);
    border-radius: var(--radius-full);
    color: var(--c-text-subtle);

    &:focus-within {
      border-color: var(--c-accent);
    }

    input {
      width: 180px;
      background: none;
      border: 0;
      outline: none;
      font-size: var(--fs-sm);
      color: var(--c-text);
    }
  }

  &__empty {
    margin: 20px;
  }
}

.row {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  transition: background-color var(--dur-fast) var(--ease);

  li + li & {
    border-top: 1px solid var(--c-border);
  }

  &:hover {
    background: rgb(255 255 255 / 0.03);

    .row__title {
      color: var(--c-accent-hover);
    }
  }

  &__no {
    font-size: var(--fs-sm);
    color: var(--c-text-subtle);
    font-variant-numeric: tabular-nums;
  }

  &__main {
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    transition: color var(--dur-fast) var(--ease);
    @include line-clamp(1);
  }

  &__excerpt {
    margin-top: 2px;
    font-size: var(--fs-sm);
    color: var(--c-text-subtle);
    @include line-clamp(1);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  &__author {
    color: var(--c-text-muted);
    font-weight: 600;
  }

  @include down(md) {
    grid-template-columns: 1fr;
    gap: 8px;

    &__no {
      display: none;
    }
  }
}

.pagination {
  margin-top: 32px;
}
</style>

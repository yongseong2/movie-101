<script setup lang="ts">
const route = useRoute()
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))

const { data: results, pending, error, refresh } = useMovieSearch(query)

useSeoMeta({ title: () => (query.value ? `"${query.value}" 검색 결과` : '검색') })
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <p class="page-header__eyebrow">
          <UiIcon
            name="search"
            :size="16"
          /> SEARCH
        </p>
        <h1
          v-if="query"
          class="page-header__title"
        >
          “{{ query }}” 검색 결과
        </h1>
        <h1
          v-else
          class="page-header__title"
        >
          영화 검색
        </h1>
        <p
          v-if="query && !pending"
          class="page-header__desc"
        >
          총 {{ results.length }}편의 영화를 찾았어요.
        </p>
      </div>
    </header>

    <UiEmptyState
      v-if="!query"
      icon="search"
      title="어떤 영화를 찾고 계신가요?"
      description="상단 검색창에 영화 제목을 입력해보세요."
    />

    <UiEmptyState
      v-else-if="error"
      icon="alert"
      title="검색 중 문제가 발생했어요"
    >
      <UiButton
        variant="secondary"
        @click="refresh()"
      >
        다시 시도
      </UiButton>
    </UiEmptyState>

    <MovieGrid
      v-else-if="pending"
      :movies="[]"
      pending
    />

    <UiEmptyState
      v-else-if="!results.length"
      icon="film"
      :title="`“${query}”에 대한 결과가 없어요`"
      description="띄어쓰기나 철자를 확인하거나, 다른 제목으로 검색해보세요."
    />

    <MovieGrid
      v-else
      :movies="results"
    />
  </div>
</template>

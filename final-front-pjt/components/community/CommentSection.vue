<script setup lang="ts">
import type { Comment } from '~/types'

const props = defineProps<{
  articleId: number
  comments: Comment[]
}>()

const auth = useAuthStore()
const route = useRoute()

const actions = useCommentActions(props.articleId, () => refreshNuxtData(articleDataKey(props.articleId)))
const draft = ref('')

// 최신 댓글이 아래로 오도록 작성 시간 순 정렬
const sorted = computed(() =>
  [...props.comments].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
)

async function submit() {
  const content = draft.value.trim()
  if (!content) return
  if (await actions.create.run(content)) draft.value = ''
}

async function update(id: number, content: string, done: () => void) {
  if (await actions.update.run(id, content)) done()
}
</script>

<template>
  <section
    class="comments"
    aria-labelledby="comments-title"
  >
    <h2
      id="comments-title"
      class="comments__title"
    >
      댓글 <span>{{ comments.length }}</span>
    </h2>

    <form
      v-if="auth.isLoggedIn"
      class="comments__form"
      @submit.prevent="submit"
    >
      <UiAvatar
        :name="auth.username ?? ''"
        :size="36"
      />
      <UiField
        v-model="draft"
        label="댓글 작성"
        hide-label
        placeholder="댓글을 남겨보세요"
        :maxlength="500"
        class="comments__input"
      />
      <UiButton
        type="submit"
        :loading="actions.create.pending.value"
        :disabled="!draft.trim()"
      >
        등록
      </UiButton>
    </form>
    <p
      v-else
      class="comments__login"
    >
      <NuxtLink :to="{ path: '/login', query: { redirect: route.fullPath } }">로그인</NuxtLink>
      하고 댓글을 남겨보세요.
    </p>

    <ul
      v-if="sorted.length"
      class="comments__list"
    >
      <CommunityCommentItem
        v-for="comment in sorted"
        :key="comment.id"
        :comment="comment"
        :updating="actions.update.pending.value"
        @update="update"
        @remove="actions.remove.run($event)"
      />
    </ul>
    <p
      v-else
      class="comments__empty"
    >
      첫 댓글을 남겨보세요.
    </p>
  </section>
</template>

<style scoped lang="scss">
.comments {
  &__title {
    font-size: var(--fs-xl);

    span {
      color: var(--c-accent);
    }
  }

  &__form {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 20px;

    > :last-child {
      height: 48px;
    }
  }

  &__input {
    flex: 1;
  }

  &__login {
    margin-top: 20px;
    padding: 18px;
    border-radius: var(--radius-md);
    background: var(--c-surface-2);
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    text-align: center;

    a {
      color: var(--c-accent);
      font-weight: 600;
    }
  }

  &__list {
    margin-top: 12px;
  }

  &__empty {
    padding: 32px 0;
    text-align: center;
    color: var(--c-text-subtle);
    font-size: var(--fs-sm);
  }
}
</style>

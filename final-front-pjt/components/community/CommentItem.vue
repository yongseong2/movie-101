<script setup lang="ts">
import type { Comment } from '~/types'

const props = defineProps<{
  comment: Comment
  updating?: boolean
}>()

const emit = defineEmits<{
  update: [id: number, content: string, done: () => void]
  remove: [id: number]
}>()

const auth = useAuthStore()
// 댓글마다 GET 요청으로 is_mine 을 확인하던 N+1 호출을 작성자 비교로 대체
const isMine = computed(() => auth.isMe(props.comment.username))

const editing = ref(false)
const draft = ref('')

function startEdit() {
  draft.value = props.comment.content
  editing.value = true
}

function save() {
  const content = draft.value.trim()
  if (!content || content === props.comment.content) {
    editing.value = false
    return
  }
  emit('update', props.comment.id, content, () => {
    editing.value = false
  })
}
</script>

<template>
  <li class="comment">
    <NuxtLink
      :to="`/profile/${comment.username}`"
      class="comment__avatar"
      :aria-label="`${comment.username} 프로필`"
    >
      <UiAvatar
        :name="comment.username"
        :size="36"
      />
    </NuxtLink>
    <div class="comment__main">
      <div class="comment__header">
        <NuxtLink
          :to="`/profile/${comment.username}`"
          class="comment__name"
        >
          {{ comment.username }}
        </NuxtLink>
        <time
          class="comment__date"
          :datetime="comment.created_at"
          :title="formatDateTime(comment.created_at)"
        >
          {{ formatRelativeTime(comment.created_at) }}
        </time>
      </div>

      <form
        v-if="editing"
        class="comment__edit"
        @submit.prevent="save"
      >
        <UiField
          v-model="draft"
          label="댓글 수정"
          hide-label
          :maxlength="500"
        />
        <div class="comment__edit-actions">
          <UiButton
            variant="ghost"
            size="sm"
            @click="editing = false"
          >
            취소
          </UiButton>
          <UiButton
            type="submit"
            size="sm"
            :loading="updating"
          >
            저장
          </UiButton>
        </div>
      </form>
      <p
        v-else
        class="comment__body"
      >
        {{ comment.content }}
      </p>

      <div
        v-if="isMine && !editing"
        class="comment__actions"
      >
        <button
          type="button"
          @click="startEdit"
        >
          수정
        </button>
        <button
          type="button"
          @click="emit('remove', comment.id)"
        >
          삭제
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.comment {
  display: flex;
  gap: 12px;
  padding-block: 18px;

  & + & {
    border-top: 1px solid var(--c-border);
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  &__name {
    font-size: var(--fs-sm);
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }

  &__date {
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }

  &__body {
    margin-top: 4px;
    white-space: pre-line;
  }

  &__edit {
    margin-top: 8px;
  }

  &__edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 8px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 6px;

    button {
      font-size: var(--fs-xs);
      color: var(--c-text-subtle);

      &:hover {
        color: var(--c-text);
      }
    }
  }
}
</style>

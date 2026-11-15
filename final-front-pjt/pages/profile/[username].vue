<script setup lang="ts">
definePageMeta({ requiresAuth: true })

type Tab = 'articles' | 'comments' | 'reviews'

const route = useRoute()
const username = String(route.params.username)
const mediaUrl = useMediaUrl()

const { data: profile, error, refresh } = await useProfile(username)

if (error.value || !profile.value) {
  throw createError({ statusCode: 404, statusMessage: '사용자를 찾을 수 없습니다.', fatal: true })
}

useSeoMeta({ title: `${username}님의 프로필` })

const upload = useProfileImageUpload(username, refresh)
const fileInput = ref<HTMLInputElement | null>(null)

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) await upload.run(file)
  input.value = ''
}

const tab = ref<Tab>('articles')
const tabs = computed(() => [
  { value: 'articles' as const, label: '게시글', count: profile.value?.articles_count ?? 0 },
  { value: 'comments' as const, label: '댓글', count: profile.value?.comments_count ?? 0 },
  { value: 'reviews' as const, label: '한줄평', count: profile.value?.reviews_count ?? profile.value?.reviews.length ?? 0 },
])

const avatarSrc = computed(() => (profile.value?.img ? mediaUrl(profile.value.img) : null))
const bannerSrc = computed(() => (profile.value?.background_img ? mediaUrl(profile.value.background_img) : null))
const byNewest = <T extends { created_at: string }>(items: T[]) =>
  [...items].sort((a, b) => b.created_at.localeCompare(a.created_at))
</script>

<template>
  <div
    v-if="profile"
    class="profile"
  >
    <div
      class="profile__banner"
      :style="bannerSrc ? { backgroundImage: `url(${bannerSrc})` } : undefined"
    />

    <div class="container">
      <header class="profile__header">
        <div class="profile__avatar">
          <UiAvatar
            :name="profile.username"
            :src="avatarSrc"
            :size="128"
          />
          <template v-if="profile.is_mine">
            <button
              type="button"
              class="profile__avatar-btn"
              aria-label="프로필 사진 변경"
              :disabled="upload.pending.value"
              @click="fileInput?.click()"
            >
              <UiSpinner
                v-if="upload.pending.value"
                :size="16"
              />
              <UiIcon
                v-else
                name="camera"
                :size="16"
              />
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="onFileChange"
            >
          </template>
        </div>

        <div class="profile__identity">
          <h1 class="profile__name">
            {{ profile.username }}
            <span
              v-if="profile.is_mine"
              class="profile__badge"
            >나</span>
          </h1>
          <p class="profile__joined">
            <UiIcon
              name="calendar"
              :size="14"
            />
            {{ formatDate(profile.date_joined) }} 가입
          </p>
        </div>

        <UiButton
          v-if="profile.is_mine"
          to="/account/password"
          variant="outline"
          size="sm"
          icon="lock"
          class="profile__action"
        >
          비밀번호 변경
        </UiButton>
      </header>

      <div
        class="tabs"
        role="tablist"
        aria-label="활동 내역"
      >
        <button
          v-for="item in tabs"
          :key="item.value"
          type="button"
          role="tab"
          class="tabs__btn"
          :class="{ 'is-active': tab === item.value }"
          :aria-selected="tab === item.value"
          @click="tab = item.value"
        >
          {{ item.label }} <span>{{ item.count }}</span>
        </button>
      </div>

      <section
        class="activity"
        role="tabpanel"
      >
        <template v-if="tab === 'articles'">
          <ul
            v-if="profile.articles.length"
            class="activity__list"
          >
            <li
              v-for="article in byNewest(profile.articles)"
              :key="article.id"
            >
              <NuxtLink
                :to="`/community/${article.id}`"
                class="activity__item"
              >
                <p class="activity__title">
                  {{ article.title }}
                </p>
                <p class="activity__meta">
                  {{ formatDate(article.created_at) }} · 댓글 {{ article.comment_count }}
                </p>
              </NuxtLink>
            </li>
          </ul>
          <UiEmptyState
            v-else
            icon="edit"
            title="작성한 게시글이 없어요"
          />
        </template>

        <template v-else-if="tab === 'comments'">
          <ul
            v-if="profile.comments.length"
            class="activity__list"
          >
            <li
              v-for="comment in byNewest(profile.comments)"
              :key="comment.id"
            >
              <NuxtLink
                :to="`/community/${comment.article}`"
                class="activity__item"
              >
                <p class="activity__title">
                  {{ comment.content }}
                </p>
                <p class="activity__meta">
                  {{ formatDate(comment.created_at) }} · 원문 보기
                </p>
              </NuxtLink>
            </li>
          </ul>
          <UiEmptyState
            v-else
            icon="message"
            title="작성한 댓글이 없어요"
          />
        </template>

        <template v-else>
          <ul
            v-if="profile.reviews.length"
            class="activity__list"
          >
            <li
              v-for="review in byNewest(profile.reviews)"
              :key="review.id"
            >
              <NuxtLink
                :to="`/movies/${review.movie}`"
                class="activity__item"
              >
                <UiStarRating
                  :model-value="review.rate"
                  readonly
                  :size="14"
                />
                <p class="activity__title">
                  {{ review.review }}
                </p>
                <p class="activity__meta">
                  {{ formatDate(review.created_at) }} · 영화 보기
                </p>
              </NuxtLink>
            </li>
          </ul>
          <UiEmptyState
            v-else
            icon="star"
            title="작성한 한줄평이 없어요"
          />
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile {
  padding-bottom: 96px;

  &__banner {
    height: clamp(160px, 26vw, 280px);
    background:
      linear-gradient(to bottom, transparent 40%, var(--c-bg)),
      radial-gradient(circle at 20% 30%, rgb(255 77 109 / 0.45), transparent 50%),
      radial-gradient(circle at 80% 60%, rgb(255 200 87 / 0.3), transparent 55%),
      var(--c-surface);
    background-size: cover;
    background-position: center;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgb(10 10 15 / 0.1), var(--c-bg));
    }
  }

  &__header {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 20px 24px;
    margin-top: -64px;
  }

  &__avatar {
    position: relative;

    :deep(.avatar) {
      box-shadow: 0 0 0 4px var(--c-bg);
    }
  }

  &__avatar-btn {
    position: absolute;
    right: 4px;
    bottom: 4px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--c-text);
    color: var(--c-bg);
    box-shadow: var(--shadow-md);
    transition: transform var(--dur-fast) var(--ease);

    &:hover {
      transform: scale(1.08);
    }
  }

  &__identity {
    flex: 1;
    min-width: 200px;
    padding-bottom: 8px;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--fs-3xl);
  }

  &__badge {
    padding: 2px 10px;
    border-radius: var(--radius-full);
    background: var(--c-accent-soft);
    color: var(--c-accent);
    font-size: var(--fs-xs);
  }

  &__joined {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }

  &__action {
    margin-bottom: 8px;
  }
}

.tabs {
  display: flex;
  gap: 4px;
  margin-top: 40px;
  border-bottom: 1px solid var(--c-border);

  &__btn {
    position: relative;
    padding: 14px 18px;
    font-weight: 600;
    color: var(--c-text-muted);

    span {
      margin-left: 4px;
      color: var(--c-text-subtle);
      font-variant-numeric: tabular-nums;
    }

    &::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: -1px;
      height: 2px;
      border-radius: 2px;
      background: var(--c-accent);
      transform: scaleX(0);
      transition: transform var(--dur) var(--ease);
    }

    &.is-active {
      color: var(--c-text);

      span {
        color: var(--c-accent);
      }

      &::after {
        transform: scaleX(1);
      }
    }
  }
}

.activity {
  margin-top: 24px;

  &__list {
    display: grid;
    gap: 10px;

    @include up(md) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    height: 100%;
    padding: 18px 20px;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-md);
    transition: border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);

    &:hover {
      border-color: var(--c-border-strong);
      transform: translateY(-1px);
    }
  }

  &__title {
    font-weight: 600;
    @include line-clamp(2);
  }

  &__meta {
    margin-top: auto;
    font-size: var(--fs-xs);
    color: var(--c-text-subtle);
  }
}
</style>

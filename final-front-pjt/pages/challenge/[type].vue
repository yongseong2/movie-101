<script setup lang="ts">
import type { Side } from '~/composables/useTournament'
import type { Candidate, ChallengeType } from '~/types'
import { isChallengeType } from '~/utils/challenge'

/**
 * 영화 월드컵 · 배우 월드컵 공용 페이지 (/challenge/movie, /challenge/actor)
 * Vue 2 에서 MovieChallengeView / ActorsChallengeView 와 하위 컴포넌트 6개로 중복 구현되어 있던 화면을 하나로 통합했다.
 */
definePageMeta({
  requiresAuth: true,
  validate: route => isChallengeType(route.params.type),
})

const route = useRoute()
const type = route.params.type as ChallengeType
const definition = useChallengeDefinition(type)

useSeoMeta({ title: definition.title, description: definition.description })

const { data: candidates, status, refresh } = useAsyncData(
  `challenge:${type}:candidates`,
  definition.fetchCandidates,
  { server: false, default: () => [] as Candidate[] },
)
// 서버에서는 'idle', 하이드레이션 시점 클라이언트에서는 'pending' 이므로 둘 다 로딩으로 취급해 마크업을 일치시킨다
const loadingCandidates = computed(() => status.value === 'idle' || status.value === 'pending')

const tournament = useTournament<Candidate>()
const phase = computed(() => {
  if (tournament.isFinished.value) return 'result'
  if (tournament.isStarted.value) return 'playing'
  return 'intro'
})

// 대결 화면 전환을 매끄럽게 하기 위해 후보 이미지를 미리 받아둔다
watch(candidates, (list) => {
  if (!import.meta.client) return
  list.forEach((candidate) => {
    new Image().src = candidate.image
  })
}, { immediate: true })

function start() {
  if (candidates.value.length < 2) return
  tournament.start(candidates.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function restart() {
  tournament.reset()
  await refresh()
}

// ---- 선택 (선택 애니메이션이 끝난 뒤 다음 대결로 넘어간다) ----
const chosen = ref<Side | null>(null)
let pickTimer: ReturnType<typeof setTimeout> | undefined

function choose(side: Side) {
  if (chosen.value || !tournament.match.value) return
  chosen.value = side
  pickTimer = setTimeout(() => {
    tournament.pick(side)
    chosen.value = null
  }, 450)
}

function stateOf(side: Side) {
  if (!chosen.value) return 'idle'
  return chosen.value === side ? 'chosen' : 'dropped'
}

// ---- 키보드 단축키: ← / → 선택, Backspace 되돌리기 ----
function onKeydown(event: KeyboardEvent) {
  if (phase.value !== 'playing' || event.metaKey || event.ctrlKey) return
  if (event.key === 'ArrowLeft') choose('left')
  else if (event.key === 'ArrowRight') choose('right')
  else if (event.key === 'Backspace' && tournament.canUndo.value && !chosen.value) tournament.undo()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(pickTimer)
})
</script>

<template>
  <div class="page container challenge">
    <!-- 시작 전 -->
    <section
      v-if="phase === 'intro'"
      class="intro"
    >
      <p class="page-header__eyebrow">
        <UiIcon
          name="trophy"
          :size="16"
        /> WORLD CUP
      </p>
      <h1 class="intro__title">
        {{ definition.title }} <span>32강</span>
      </h1>
      <p class="intro__desc">
        {{ definition.description }}
      </p>

      <ol class="intro__steps">
        <li><strong>32</strong> 후보가 무작위로 뽑혀요</li>
        <li><strong>1:1</strong> 대결에서 더 끌리는 쪽을 골라요</li>
        <li><strong>31번</strong>의 선택 끝에 우승자와 추천 영화를 받아요</li>
      </ol>

      <div
        class="intro__preview"
        aria-hidden="true"
      >
        <template v-if="status === 'success'">
          <img
            v-for="candidate in candidates.slice(0, 8)"
            :key="candidate.id"
            :src="candidate.image"
            alt=""
          >
        </template>
        <UiSkeleton
          v-for="n in 8"
          v-else
          :key="n"
          height="auto"
          radius="var(--radius-md)"
          style="aspect-ratio: 2 / 3"
        />
      </div>

      <div class="intro__actions">
        <UiButton
          size="lg"
          icon="play"
          :loading="loadingCandidates"
          :disabled="candidates.length < 2"
          @click="start"
        >
          시작하기
        </UiButton>
        <UiButton
          variant="ghost"
          size="lg"
          icon="shuffle"
          :disabled="loadingCandidates"
          @click="refresh()"
        >
          후보 다시 뽑기
        </UiButton>
      </div>
      <p
        v-if="status === 'error'"
        class="intro__error"
        role="alert"
      >
        후보를 불러오지 못했어요. 다시 뽑기를 눌러주세요.
      </p>
    </section>

    <!-- 진행 중 -->
    <section
      v-else-if="phase === 'playing' && tournament.match.value"
      class="arena"
    >
      <header class="arena__header">
        <div>
          <p class="arena__round">
            {{ tournament.roundLabel.value }}
            <span>{{ tournament.matchNumber.value }} / {{ tournament.matchesInRound.value }}</span>
          </p>
          <h1 class="arena__prompt">
            {{ definition.prompt }}
          </h1>
        </div>
        <UiButton
          variant="ghost"
          size="sm"
          icon="undo"
          :disabled="!tournament.canUndo.value || !!chosen"
          @click="tournament.undo()"
        >
          되돌리기
        </UiButton>
      </header>

      <div
        class="arena__progress"
        role="progressbar"
        :aria-valuenow="tournament.played.value"
        :aria-valuemax="tournament.totalMatches.value"
        aria-label="진행률"
      >
        <span :style="{ transform: `scaleX(${tournament.progress.value})` }" />
      </div>

      <Transition
        name="match"
        mode="out-in"
      >
        <div
          :key="`${tournament.match.value.left.id}-${tournament.match.value.right.id}`"
          class="arena__match"
        >
          <ChallengeCandidate
            :candidate="tournament.match.value.left"
            side="left"
            hotkey="←"
            :state="stateOf('left')"
            @pick="choose('left')"
          />
          <span
            class="arena__vs"
            aria-hidden="true"
          >VS</span>
          <ChallengeCandidate
            :candidate="tournament.match.value.right"
            side="right"
            hotkey="→"
            :state="stateOf('right')"
            @pick="choose('right')"
          />
        </div>
      </Transition>
    </section>

    <!-- 결과 -->
    <ChallengeResult
      v-else-if="phase === 'result' && tournament.champion.value"
      :champion="tournament.champion.value"
      :label="definition.resultLabel(tournament.champion.value)"
      :fetch-recommendation="definition.fetchRecommendation"
      @restart="restart"
    />
  </div>
</template>

<style scoped lang="scss">
.intro {
  max-width: 760px;
  margin-inline: auto;
  text-align: center;

  &__title {
    font-size: var(--fs-display);
    font-weight: 800;
    letter-spacing: -0.04em;

    span {
      color: var(--c-accent);
    }
  }

  &__desc {
    margin-top: 12px;
    font-size: var(--fs-lg);
    color: var(--c-text-muted);
  }

  &__steps {
    display: grid;
    gap: 10px;
    margin-top: 32px;
    counter-reset: step;

    @include up(md) {
      grid-template-columns: repeat(3, 1fr);
    }

    li {
      padding: 18px;
      border: 1px solid var(--c-border);
      border-radius: var(--radius-lg);
      background: var(--c-surface);
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }

    strong {
      display: block;
      margin-bottom: 4px;
      font-size: var(--fs-xl);
      color: var(--c-text);
    }
  }

  &__preview {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
    margin-top: 40px;
    opacity: 0.8;

    img {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    @include down(md) {
      grid-template-columns: repeat(4, 1fr);

      > :nth-child(n + 5) {
        display: none;
      }
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 40px;
  }

  &__error {
    margin-top: 16px;
    color: var(--c-danger);
    font-size: var(--fs-sm);
  }
}

.arena {
  max-width: 980px;
  margin-inline: auto;

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  &__round {
    font-size: var(--fs-sm);
    font-weight: 700;
    color: var(--c-accent);

    span {
      margin-left: 6px;
      color: var(--c-text-subtle);
      font-variant-numeric: tabular-nums;
    }
  }

  &__prompt {
    margin-top: 4px;
    font-size: var(--fs-2xl);
  }

  &__progress {
    height: 4px;
    margin: 20px 0 32px;
    overflow: hidden;
    border-radius: 4px;
    background: var(--c-surface-3);

    span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--c-accent), var(--c-gold));
      transform-origin: left;
      transition: transform 500ms var(--ease);
    }
  }

  &__match {
    // 포스터(2:3)가 화면 높이를 넘지 않도록 카드 폭을 뷰포트 높이에 맞춰 제한한다
    --card-max: calc((100dvh - var(--header-h) - 240px) * 2 / 3);

    position: relative;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, max(var(--card-max), 160px)));
    justify-content: center;
    gap: clamp(12px, 4vw, 48px);
    align-items: center;
  }

  &__vs {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    display: grid;
    place-items: center;
    width: clamp(48px, 8vw, 72px);
    height: clamp(48px, 8vw, 72px);
    border-radius: 50%;
    background: var(--c-bg);
    border: 2px solid var(--c-border-strong);
    font-size: clamp(0.875rem, 2vw, 1.25rem);
    font-weight: 900;
    font-style: italic;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
}

.match-enter-active,
.match-leave-active {
  transition: opacity 220ms var(--ease), transform 220ms var(--ease);
}

.match-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.match-leave-to {
  opacity: 0;
}
</style>

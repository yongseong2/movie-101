import { computed, ref, shallowRef } from 'vue'

export type Side = 'left' | 'right'

interface Snapshot<T> {
  queue: T[]
  winners: T[]
  roundSize: number
  played: number
}

export function getRoundLabel(size: number): string {
  if (size <= 1) return ''
  if (size === 2) return '결승'
  if (size === 4) return '준결승'
  return `${size}강`
}

/**
 * 싱글 엘리미네이션 토너먼트(이상형 월드컵) 로직.
 *
 * Vue 2 에서는 영화/배우 월드컵 페이지에 동일한 data·watch 로직이 복사되어 있었고,
 * left/right watcher 의 실행 순서에 의존해 라운드 종료를 판별했다.
 * 상태 전이를 pick → settle 한 곳으로 모으고 제네릭으로 만들어 어떤 후보 타입에도 재사용할 수 있다.
 */
export function useTournament<T>() {
  const queue = shallowRef<T[]>([])
  const winners = shallowRef<T[]>([])
  const roundSize = ref(0)
  const played = ref(0)
  const totalMatches = ref(0)
  const champion = shallowRef<T | null>(null)
  const history = shallowRef<Snapshot<T>[]>([])

  const match = computed(() => {
    const [left, right] = queue.value
    return left !== undefined && right !== undefined ? { left, right } : null
  })

  const roundLabel = computed(() => getRoundLabel(roundSize.value))
  const matchesInRound = computed(() => Math.floor(roundSize.value / 2))
  const matchNumber = computed(() => matchesInRound.value - Math.floor(queue.value.length / 2) + 1)
  const progress = computed(() => (totalMatches.value ? played.value / totalMatches.value : 0))
  const isStarted = computed(() => totalMatches.value > 0 || champion.value !== null)
  const isFinished = computed(() => champion.value !== null)
  const canUndo = computed(() => history.value.length > 0)

  /** 남은 후보가 1명뿐인 경우(부전승) 다음 라운드로 올리고, 라운드가 끝나면 다음 라운드를 구성한다 */
  function settle() {
    if (queue.value.length === 1) {
      winners.value = [...winners.value, ...queue.value]
      queue.value = []
    }
    if (queue.value.length > 0) return

    if (winners.value.length === 1) {
      champion.value = winners.value[0] ?? null
    }
    else if (winners.value.length > 1) {
      queue.value = winners.value
      winners.value = []
      roundSize.value = queue.value.length
    }
  }

  function start(entrants: readonly T[]) {
    queue.value = [...entrants]
    winners.value = []
    champion.value = null
    history.value = []
    played.value = 0
    roundSize.value = entrants.length
    totalMatches.value = Math.max(entrants.length - 1, 0)
    settle()
  }

  function reset() {
    start([])
    totalMatches.value = 0
  }

  function pick(side: Side) {
    const current = match.value
    if (!current) return
    history.value = [...history.value, {
      queue: queue.value,
      winners: winners.value,
      roundSize: roundSize.value,
      played: played.value,
    }]
    winners.value = [...winners.value, current[side]]
    queue.value = queue.value.slice(2)
    played.value += 1
    settle()
  }

  function undo() {
    const previous = history.value.at(-1)
    if (!previous) return
    history.value = history.value.slice(0, -1)
    queue.value = previous.queue
    winners.value = previous.winners
    roundSize.value = previous.roundSize
    played.value = previous.played
    champion.value = null
  }

  return {
    match,
    champion,
    roundSize,
    roundLabel,
    matchNumber,
    matchesInRound,
    played,
    totalMatches,
    progress,
    isStarted,
    isFinished,
    canUndo,
    start,
    reset,
    pick,
    undo,
  }
}

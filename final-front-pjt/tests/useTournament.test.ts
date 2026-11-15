import { describe, expect, it } from 'vitest'
import { getRoundLabel, useTournament } from '~/composables/useTournament'

const entrants = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i + 1 }))

/** 매 대결마다 왼쪽(또는 지정한 쪽)을 골라 끝까지 진행 */
function playAll(t: ReturnType<typeof useTournament<{ id: number }>>, side: 'left' | 'right' = 'left') {
  let guard = 0
  while (t.match.value && guard++ < 1000) t.pick(side)
}

describe('useTournament', () => {
  it('32강은 31번의 대결 끝에 우승자를 가린다', () => {
    const t = useTournament<{ id: number }>()
    t.start(entrants(32))

    expect(t.roundLabel.value).toBe('32강')
    expect(t.matchNumber.value).toBe(1)
    expect(t.matchesInRound.value).toBe(16)
    expect(t.totalMatches.value).toBe(31)

    playAll(t)

    expect(t.played.value).toBe(31)
    expect(t.isFinished.value).toBe(true)
    expect(t.champion.value).toEqual({ id: 1 })
    expect(t.progress.value).toBe(1)
  })

  it('라운드가 끝나면 승자들로 다음 라운드를 구성한다', () => {
    const t = useTournament<{ id: number }>()
    t.start(entrants(4))

    expect(t.roundLabel.value).toBe('준결승')
    t.pick('right') // 2 승
    expect(t.matchNumber.value).toBe(2)
    t.pick('left') // 3 승

    expect(t.roundLabel.value).toBe('결승')
    expect(t.match.value).toEqual({ left: { id: 2 }, right: { id: 3 } })

    t.pick('right')
    expect(t.champion.value).toEqual({ id: 3 })
  })

  it('후보 수가 홀수면 남은 후보는 부전승으로 다음 라운드에 진출한다', () => {
    const t = useTournament<{ id: number }>()
    t.start(entrants(3))

    t.pick('left') // 1 vs 2 → 1, 3 은 부전승
    expect(t.match.value).toEqual({ left: { id: 1 }, right: { id: 3 } })
    expect(t.roundLabel.value).toBe('결승')

    t.pick('right')
    expect(t.champion.value).toEqual({ id: 3 })
    expect(t.played.value).toBe(t.totalMatches.value)
  })

  it('undo 로 직전 선택(라운드 경계 포함)을 되돌릴 수 있다', () => {
    const t = useTournament<{ id: number }>()
    t.start(entrants(4))
    t.pick('left')
    t.pick('left') // 결승 진입

    expect(t.roundLabel.value).toBe('결승')
    t.undo()
    expect(t.roundLabel.value).toBe('준결승')
    expect(t.match.value).toEqual({ left: { id: 3 }, right: { id: 4 } })
    expect(t.played.value).toBe(1)

    playAll(t, 'right')
    expect(t.isFinished.value).toBe(true)
    t.undo()
    expect(t.isFinished.value).toBe(false)
    expect(t.canUndo.value).toBe(true)
  })

  it('후보가 1명이면 바로 우승, 0명이면 시작하지 않는다', () => {
    const single = useTournament<{ id: number }>()
    single.start(entrants(1))
    expect(single.champion.value).toEqual({ id: 1 })

    const empty = useTournament<{ id: number }>()
    empty.start([])
    expect(empty.match.value).toBeNull()
    expect(empty.isStarted.value).toBe(false)
  })

  it('reset 하면 시작 전 상태로 돌아간다', () => {
    const t = useTournament<{ id: number }>()
    t.start(entrants(8))
    t.pick('left')
    t.reset()
    expect(t.isStarted.value).toBe(false)
    expect(t.match.value).toBeNull()
    expect(t.canUndo.value).toBe(false)
  })
})

describe('getRoundLabel', () => {
  it.each([
    [32, '32강'],
    [16, '16강'],
    [4, '준결승'],
    [2, '결승'],
    [1, ''],
  ])('%i → %s', (size, label) => {
    expect(getRoundLabel(size)).toBe(label)
  })
})

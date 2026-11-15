import type { Ref } from 'vue'

/** target 바깥을 클릭하면 handler 를 실행한다 (드롭다운 · 팝오버 닫기용) */
export function useClickOutside(target: Ref<HTMLElement | null>, handler: (event: PointerEvent) => void) {
  function listener(event: PointerEvent) {
    const el = target.value
    if (el && !el.contains(event.target as Node)) handler(event)
  }

  onMounted(() => document.addEventListener('pointerdown', listener))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener))
}

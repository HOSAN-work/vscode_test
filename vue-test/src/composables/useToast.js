import { readonly, ref } from 'vue'

export const POINT_TOAST_PRESETS = Object.freeze({
  'daily-login': { title: '今日首次登入獎勵', sign: '+', tone: 'reward' },
  'daily-post': { title: '今日首次發文獎勵', sign: '+', tone: 'reward' },
  'daily-comment': { title: '今日首次留言獎勵', sign: '+', tone: 'reward' },
  'daily-like': { title: '今日首次點讚獎勵', sign: '+', tone: 'reward' },
  'shop-purchase': { title: '商城消費扣除點數', sign: '-', tone: 'deduction' },
  'platform-sponsor': { title: '贊助平台獲得點數', sign: '+', tone: 'reward' },
})

const toasts = ref([])
const dismissTimers = new Map()
let nextToastId = 1

function formatPointDelta(sign, points) {
  if (points === undefined || points === null || points === '') return `${sign}?`
  if (typeof points === 'number') return `${sign}${Math.abs(points).toLocaleString('zh-TW')}`
  return `${sign}${String(points).replace(/^[+-]/, '')}`
}

export function useToast() {
  function dismissToast(id) {
    const timer = dismissTimers.get(id)
    if (timer) window.clearTimeout(timer)
    dismissTimers.delete(id)
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function showPointToast(type, points, options = {}) {
    const preset = POINT_TOAST_PRESETS[type]
    if (!preset) throw new Error(`Unknown point toast type: ${type}`)

    const duration = options.duration ?? 5200
    const toast = {
      id: nextToastId,
      type,
      title: options.title ?? preset.title,
      tone: preset.tone,
      pointDelta: formatPointDelta(preset.sign, points),
      duration,
    }

    nextToastId += 1
    toasts.value = [...toasts.value, toast]

    const timer = window.setTimeout(() => dismissToast(toast.id), duration)
    dismissTimers.set(toast.id, timer)
    return toast.id
  }

  return {
    toasts: readonly(toasts),
    showPointToast,
    dismissToast,
  }
}

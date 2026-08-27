import { readonly, ref } from 'vue'

const isOpen = ref(false)
const stampAnimationDate = ref(null)
const lastDailyOpenDate = ref(null)
const checkedDateKeys = ref(
  new Set([
    '2026-07-24',
    '2026-07-29',
    '2026-08-19',
    '2026-08-20',
    '2026-08-21',
  ]),
)

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addCheckedDate(dateKey) {
  if (checkedDateKeys.value.has(dateKey)) return
  checkedDateKeys.value = new Set([...checkedDateKeys.value, dateKey])
}

export function useCheckIn() {
  function openCheckIn(options = {}) {
    const { stampToday = false } = options

    if (stampToday) {
      const todayKey = formatDateKey(new Date())
      addCheckedDate(todayKey)
      stampAnimationDate.value = todayKey
    } else {
      stampAnimationDate.value = null
    }

    isOpen.value = true
  }

  function openDailyCheckIn() {
    const todayKey = formatDateKey(new Date())
    if (lastDailyOpenDate.value === todayKey) return

    lastDailyOpenDate.value = todayKey
    openCheckIn({ stampToday: true })
  }

  function closeCheckIn() {
    isOpen.value = false
    stampAnimationDate.value = null
  }

  return {
    isOpen: readonly(isOpen),
    checkedDateKeys: readonly(checkedDateKeys),
    stampAnimationDate: readonly(stampAnimationDate),
    openCheckIn,
    openDailyCheckIn,
    closeCheckIn,
  }
}

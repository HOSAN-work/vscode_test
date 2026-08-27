<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCheckIn } from '../../composables/useCheckIn'

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const today = new Date()
const displayMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const closeButton = ref(null)
const { isOpen, checkedDateKeys, stampAnimationDate, closeCheckIn } = useCheckIn()

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(dateKey) {
  const [year, month] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, 1)
}

const todayKey = formatDateKey(today)

const monthTitle = computed(() => {
  const year = displayMonth.value.getFullYear()
  const month = displayMonth.value.getMonth() + 1
  return `${year} 年 ${month} 月`
})

const calendarCells = computed(() => {
  const year = displayMonth.value.getFullYear()
  const month = displayMonth.value.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1
    if (day < 1 || day > daysInMonth) {
      return { key: `blank-${year}-${month}-${index}`, day: null }
    }

    const date = new Date(year, month, day)
    const key = formatDateKey(date)
    return {
      key,
      day,
      checked: checkedDateKeys.value.has(key),
      today: key === todayKey,
      animateStamp: key === stampAnimationDate.value,
    }
  })
})

const checkedDaysInMonth = computed(
  () => calendarCells.value.filter((cell) => cell.checked).length,
)

const showTodayCompletion = computed(
  () =>
    stampAnimationDate.value === todayKey &&
    displayMonth.value.getFullYear() === today.getFullYear() &&
    displayMonth.value.getMonth() === today.getMonth(),
)

function changeMonth(offset) {
  const year = displayMonth.value.getFullYear()
  const month = displayMonth.value.getMonth()
  displayMonth.value = new Date(year, month + offset, 1)
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) closeCheckIn()
}

watch(
  isOpen,
  async (open) => {
    document.body.classList.toggle('has-check-in-modal', open)
    if (!open) return

    if (stampAnimationDate.value) {
      displayMonth.value = parseDateKey(stampAnimationDate.value)
    }

    await nextTick()
    closeButton.value?.focus()
  },
  { immediate: true },
)

onMounted(() => document.addEventListener('keydown', handleKeydown))

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('has-check-in-modal')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="check-in-modal">
      <div v-if="isOpen" class="check-in-backdrop" @click.self="closeCheckIn">
        <section
          class="check-in-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="check-in-title"
        >
          <header class="check-in-heading">
            <div class="check-in-heading-icon" aria-hidden="true">
              <svg><use href="#icon-calendar" /></svg>
              <span>🐾</span>
            </div>
            <div>
              <p>Daily check-in</p>
              <h2 id="check-in-title">每日簽到</h2>
              <small>留下今天的腳印，累積與毛孩的每一天</small>
            </div>
            <button
              ref="closeButton"
              class="check-in-close"
              type="button"
              aria-label="關閉每日簽到"
              @click="closeCheckIn"
            >
              <svg><use href="#icon-x" /></svg>
            </button>
          </header>

          <div class="check-in-content">
            <div class="check-in-month-controls">
              <button type="button" aria-label="查看上個月" @click="changeMonth(-1)">
                <svg><use href="#icon-chevron" /></svg>
              </button>
              <strong>{{ monthTitle }}</strong>
              <button type="button" aria-label="查看下個月" @click="changeMonth(1)">
                <svg><use href="#icon-chevron" /></svg>
              </button>
            </div>

            <div class="check-in-weekdays" aria-hidden="true">
              <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
            </div>

            <div class="check-in-calendar" role="grid" :aria-label="`${monthTitle}簽到紀錄`">
              <div
                v-for="cell in calendarCells"
                :key="cell.key"
                class="check-in-day"
                :class="{
                  'is-empty': !cell.day,
                  'is-checked': cell.checked,
                  'is-today': cell.today,
                }"
                role="gridcell"
                :aria-label="
                  cell.day
                    ? `${monthTitle}${cell.day} 日${cell.checked ? '，已簽到' : '，未簽到'}`
                    : undefined
                "
              >
                <span v-if="cell.day" class="check-in-day-number">{{ cell.day }}</span>
                <span
                  v-if="cell.checked"
                  class="check-in-stamp"
                  :class="{ 'is-animating': cell.animateStamp }"
                  aria-hidden="true"
                >
                  <svg><use href="#icon-paw" /></svg>
                </span>
                <small v-if="cell.today">今天</small>
              </div>
            </div>

            <footer class="check-in-summary">
              <span><i aria-hidden="true">🐾</i> 本月已簽到 {{ checkedDaysInMonth }} 天</span>
              <small v-if="showTodayCompletion">今日簽到完成！</small>
              <small v-else>有腳印的日期代表已完成簽到</small>
            </footer>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style src="../../styles/components/CheckInModal.css"></style>

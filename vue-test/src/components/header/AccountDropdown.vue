<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { usePoints } from '../../composables/usePoints'
import { useProfile } from '../../composables/useProfile'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'logout', 'open-check-in'])

const { currentUserId, nickname } = useProfile()
const { points, consumePendingAccountTransaction } = usePoints()
const displayedPoints = ref(points.value)
const pointDelta = ref(0)
const showPointDelta = ref(false)
const balanceUpdating = ref(false)
let balanceTimer = null
let deltaTimer = null

function clearPointAnimation() {
  if (balanceTimer) window.clearTimeout(balanceTimer)
  if (deltaTimer) window.clearTimeout(deltaTimer)
  balanceTimer = null
  deltaTimer = null
  displayedPoints.value = points.value
  pointDelta.value = 0
  showPointDelta.value = false
  balanceUpdating.value = false
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      clearPointAnimation()
      return
    }

    const transaction = consumePendingAccountTransaction()
    if (!transaction) {
      displayedPoints.value = points.value
      return
    }

    clearPointAnimation()
    displayedPoints.value = transaction.previousBalance
    pointDelta.value = transaction.amount
    showPointDelta.value = true
    await nextTick()

    window.requestAnimationFrame(() => {
      balanceUpdating.value = true
      balanceTimer = window.setTimeout(() => {
        displayedPoints.value = transaction.balance
        balanceTimer = null
      }, 320)

      deltaTimer = window.setTimeout(() => {
        showPointDelta.value = false
        balanceUpdating.value = false
        deltaTimer = null
      }, 1800)
    })
  },
)

onBeforeUnmount(clearPointAnimation)
</script>

<template>
  <div
    id="account-menu"
    class="account-menu"
    :class="{ 'is-open': open }"
    :aria-hidden="!open"
  >
    <div class="account-summary">
      <div>
        <strong>{{ nickname }}</strong>
        <span class="account-points" :class="{ 'is-updating': balanceUpdating }">
          <b>🪙</b>
          <em>{{ displayedPoints.toLocaleString('zh-TW') }}</em>
          <i
            v-if="showPointDelta"
            class="account-points-delta"
            :class="{ 'is-negative': pointDelta < 0 }"
          >
            {{ pointDelta > 0 ? '+' : '' }}{{ pointDelta.toLocaleString('zh-TW') }}
          </i>
        </span>
      </div>
    </div>

    <RouterLink
      class="account-action"
      :to="`/profile/${currentUserId}`"
      @click="$emit('close')"
    >
      <svg><use href="#icon-user" /></svg>個人主頁
    </RouterLink>
    <button class="account-action" type="button" @click="$emit('open-check-in')">
      <svg><use href="#icon-calendar" /></svg>每日簽到
    </button>
    <RouterLink class="account-action" to="/points-shop" @click="$emit('close')">
      <svg><use href="#icon-coins" /></svg>點數商城
    </RouterLink>
    <button class="account-action" type="button" @click="$emit('logout')">
      <svg><use href="#icon-logout" /></svg>登出
    </button>
  </div>
</template>

<style src="../../styles/components/AccountDropdown.css"></style>

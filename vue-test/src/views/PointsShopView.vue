<script setup>
import { ref } from 'vue'
import SponsorPaymentModal from '../components/points-shop/SponsorPaymentModal.vue'
import { usePoints } from '../composables/usePoints'
import { useToast } from '../composables/useToast'

const pointPackages = Object.freeze([
  { id: 'points-500', points: 500, price: 50, coinCount: 1, tier: 1 },
  { id: 'points-1000', points: 1000, price: 100, coinCount: 2, tier: 2 },
  { id: 'points-1500', points: 1500, price: 150, coinCount: 3, tier: 3 },
  { id: 'points-2000', points: 2000, price: 200, coinCount: 4, tier: 4 },
  { id: 'points-5000', points: 5000, price: 500, coinCount: 5, tier: 5 },
  { id: 'points-10000', points: 10000, price: 1000, coinCount: 6, tier: 6 },
])

const selectedPackage = ref(null)
const paymentOpen = ref(false)
const { applyPointTransaction } = usePoints()
const { showPointToast } = useToast()

function formatNumber(value) {
  return value.toLocaleString('zh-TW')
}

function openPayment(pointPackage) {
  selectedPackage.value = pointPackage
  paymentOpen.value = true
}

function closePayment() {
  paymentOpen.value = false
}

function completePayment({ pointPackage }) {
  const transaction = applyPointTransaction('platform-sponsor', pointPackage.points)

  if (transaction) {
    showPointToast(transaction.type, transaction.amount)
  }

  closePayment()
}
</script>

<template>
  <section class="points-shop-view" aria-labelledby="points-shop-title">
    <div class="points-shop-frame">
      <h1 id="points-shop-title" class="sr-only">PawPuff 點數商城</h1>

      <div class="points-package-grid">
        <button
          v-for="pointPackage in pointPackages"
          :key="pointPackage.id"
          type="button"
          class="points-package-card"
          :class="`is-tier-${pointPackage.tier}`"
          :aria-label="`選擇 ${formatNumber(pointPackage.points)} 點方案，價格新台幣 ${formatNumber(pointPackage.price)} 元`"
          @click="openPayment(pointPackage)"
        >
          <span class="points-package-value">
            <b>{{ formatNumber(pointPackage.points) }}</b>
            <small>POINTS</small>
          </span>

          <span class="points-coin-stage" aria-hidden="true">
            <span class="points-coin-pile">
              <i
                v-for="coinIndex in pointPackage.coinCount"
                :key="coinIndex"
                class="points-coin"
              >
                <span>🪙</span>
              </i>
            </span>
          </span>

          <span class="points-package-action">NT$ {{ formatNumber(pointPackage.price) }}</span>
        </button>
      </div>

      <footer class="points-shop-message">
        <span aria-hidden="true">🐾</span>
        <p>贊助我們，幫助平台變得更好，陪伴更多毛孩留下溫暖足跡。</p>
        <span aria-hidden="true">🐾</span>
      </footer>
    </div>

    <SponsorPaymentModal
      :open="paymentOpen"
      :point-package="selectedPackage"
      @close="closePayment"
      @confirm="completePayment"
    />
  </section>
</template>

<style src="../styles/views/PointsShopView.css"></style>

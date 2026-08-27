<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  pointPackage: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'confirm'])
const paymentMethod = ref('paypal')
let previousBodyOverflow = ''

const paymentMethods = Object.freeze([
  {
    id: 'paypal',
    name: 'PayPal',
    description: '使用 PayPal 帳戶或信用卡付款',
    badge: 'P',
    tone: 'paypal',
  },
  {
    id: 'ecpay',
    name: '綠界金流',
    description: '信用卡、ATM 或超商代碼付款',
    badge: '綠',
    tone: 'ecpay',
  },
])

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('zh-TW')
}

function closeModal() {
  emit('close')
}

function submitPayment() {
  if (!props.pointPackage) return

  emit('confirm', {
    pointPackage: props.pointPackage,
    paymentMethod: paymentMethod.value,
  })
}

function handleKeydown(event) {
  if (props.open && event.key === 'Escape') closeModal()
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      paymentMethod.value = 'paypal'
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousBodyOverflow
    }
  },
)

onMounted(() => document.addEventListener('keydown', handleKeydown))

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sponsor-payment">
      <div
        v-if="open && pointPackage"
        class="sponsor-payment-backdrop"
        role="presentation"
        @click.self="closeModal"
      >
        <section
          class="sponsor-payment-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sponsor-payment-title"
        >
          <button
            type="button"
            class="sponsor-payment-close"
            aria-label="關閉付款視窗"
            @click="closeModal"
          >
            <svg><use href="#icon-x" /></svg>
          </button>

          <header class="sponsor-payment-heading">
            <span aria-hidden="true">🪙</span>
            <div>
              <small>PawPuff Secure Checkout</small>
              <h2 id="sponsor-payment-title">確認贊助方案</h2>
              <p>目前為前端示意流程，不會產生真實扣款。</p>
            </div>
          </header>

          <div class="sponsor-payment-order">
            <div>
              <small>選擇品項</small>
              <strong>{{ formatNumber(pointPackage.points) }} PawPuff 點數</strong>
            </div>
            <div>
              <small>付款金額</small>
              <strong>NT$ {{ formatNumber(pointPackage.price) }}</strong>
            </div>
          </div>

          <form @submit.prevent="submitPayment">
            <fieldset class="sponsor-payment-methods">
              <legend>選擇付款方式</legend>

              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="sponsor-payment-method"
                :class="{ 'is-selected': paymentMethod === method.id }"
              >
                <input v-model="paymentMethod" type="radio" name="payment-method" :value="method.id" />
                <span class="sponsor-payment-badge" :class="`is-${method.tone}`" aria-hidden="true">
                  {{ method.badge }}
                </span>
                <span>
                  <strong>{{ method.name }}</strong>
                  <small>{{ method.description }}</small>
                </span>
                <i aria-hidden="true"></i>
              </label>
            </fieldset>

            <p class="sponsor-payment-notice">
              <span aria-hidden="true">✓</span>
              完成後將立即獲得 {{ formatNumber(pointPackage.points) }} 點
            </p>

            <div class="sponsor-payment-actions">
              <button type="button" class="is-secondary" @click="closeModal">返回選擇</button>
              <button type="submit" class="is-primary">
                送出付款・NT$ {{ formatNumber(pointPackage.price) }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style src="../../styles/components/SponsorPaymentModal.css"></style>

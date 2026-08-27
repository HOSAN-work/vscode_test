<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const DEMO_VALID_TOKEN = 'pawpuff-demo-valid-2026'
const DEMO_EXPIRED_TOKEN = 'pawpuff-demo-expired-2026'
const DEMO_TOKEN_LIFETIME_SECONDS = 15 * 60
const usedDemoTokens = new Set()

const route = useRoute()
const token = computed(() => String(route.query.token ?? '').trim())
const status = ref('verifying')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const remainingSeconds = ref(DEMO_TOKEN_LIFETIME_SECONDS)
let verifyTimer = null
let countdownTimer = null

const passwordChecks = computed(() => ({
  length: password.value.length >= 8,
  upper: /[A-Z]/.test(password.value),
  lower: /[a-z]/.test(password.value),
  number: /\d/.test(password.value),
}))

const passwordStrength = computed(() => {
  const completedChecks = Object.values(passwordChecks.value).filter(Boolean).length
  if (completedChecks <= 1) return '弱'
  if (completedChecks <= 3) return '中等'
  return '強'
})

const passwordsMatch = computed(() => (
  Boolean(confirmPassword.value) && password.value === confirmPassword.value
))
const canSubmit = computed(() => (
  status.value === 'valid'
  && Object.values(passwordChecks.value).every(Boolean)
  && passwordsMatch.value
))
const formattedCountdown = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

function clearTimers() {
  if (verifyTimer) window.clearTimeout(verifyTimer)
  if (countdownTimer) window.clearInterval(countdownTimer)
  verifyTimer = null
  countdownTimer = null
}

function startCountdown() {
  countdownTimer = window.setInterval(() => {
    remainingSeconds.value -= 1
    if (remainingSeconds.value > 0) return

    window.clearInterval(countdownTimer)
    countdownTimer = null
    status.value = 'expired'
  }, 1000)
}

function verifyDemoToken() {
  verifyTimer = window.setTimeout(() => {
    verifyTimer = null

    if (token.value === DEMO_EXPIRED_TOKEN) {
      status.value = 'expired'
      return
    }

    if (token.value !== DEMO_VALID_TOKEN || usedDemoTokens.has(token.value)) {
      status.value = 'invalid'
      return
    }

    status.value = 'valid'
    startCountdown()
  }, 650)
}

function submitNewPassword() {
  if (!canSubmit.value) return

  usedDemoTokens.add(token.value)
  clearTimers()
  password.value = ''
  confirmPassword.value = ''
  status.value = 'success'
}

onMounted(verifyDemoToken)
onBeforeUnmount(clearTimers)
</script>

<template>
  <section class="reset-password-view" aria-labelledby="reset-password-title">
    <div class="reset-password-card">
      <div class="reset-password-decoration" aria-hidden="true">
        <span>🐾</span><span>🐾</span><span>🐾</span>
      </div>

      <header class="reset-password-heading">
        <span>PAWPUFF ACCOUNT</span>
        <h1 id="reset-password-title">重設密碼</h1>
        <p>請設定新的登入密碼，完成儲存後舊密碼才會被替換。</p>
      </header>

      <div v-if="status === 'verifying'" class="reset-password-state" role="status">
        <div class="reset-password-loader" aria-hidden="true">
          <i></i><i></i><i></i>
        </div>
        <strong>正在確認重設連結</strong>
        <p>請稍候，系統正在檢查連結狀態。</p>
      </div>

      <form
        v-else-if="status === 'valid'"
        class="reset-password-form"
        @submit.prevent="submitNewPassword"
      >
        <div class="reset-password-validity" role="status">
          <span>連結有效</span>
          <strong>{{ formattedCountdown }}</strong>
        </div>

        <label for="reset-new-password">新密碼</label>
        <div class="reset-password-field">
          <input
            id="reset-new-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="請輸入新密碼"
          />
          <button type="button" @click="showPassword = !showPassword">
            {{ showPassword ? '隱藏' : '顯示' }}
          </button>
        </div>

        <div class="reset-password-strength" :class="`is-${passwordStrength}`">
          <strong>密碼強度：{{ passwordStrength }}</strong>
          <ul>
            <li :class="{ 'is-complete': passwordChecks.length }">至少 8 個字元</li>
            <li :class="{ 'is-complete': passwordChecks.upper }">包含大寫英文</li>
            <li :class="{ 'is-complete': passwordChecks.lower }">包含小寫英文</li>
            <li :class="{ 'is-complete': passwordChecks.number }">包含數字</li>
          </ul>
        </div>

        <label for="reset-confirm-password">確認新密碼</label>
        <div class="reset-password-field">
          <input
            id="reset-confirm-password"
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="請再次輸入新密碼"
          />
        </div>
        <p
          v-if="confirmPassword"
          class="reset-password-match"
          :class="{ 'is-match': passwordsMatch }"
        >
          {{ passwordsMatch ? '✓ 兩次密碼一致' : '✕ 兩次密碼不一致' }}
        </p>

        <button class="reset-password-submit" type="submit" :disabled="!canSubmit">
          儲存新密碼
        </button>
      </form>

      <div v-else-if="status === 'success'" class="reset-password-state is-success" role="status">
        <span aria-hidden="true">✓</span>
        <strong>新密碼已儲存</strong>
        <p>此為前端流程示意；串接後端後，成功時才會真正更新帳號密碼。</p>
        <RouterLink to="/login">返回登入</RouterLink>
      </div>

      <div v-else class="reset-password-state is-invalid" role="alert">
        <span aria-hidden="true">!</span>
        <strong>{{ status === 'expired' ? '重設連結已逾期' : '重設連結無效' }}</strong>
        <p>
          {{ status === 'expired'
            ? '此連結已超過可使用時間，請重新申請密碼重設信。'
            : 'Token 不存在、格式不正確，或此連結已經使用過。' }}
        </p>
        <RouterLink to="/forgot-password">重新申請重設連結</RouterLink>
      </div>

      <p class="reset-password-demo-note">
        目前為前端 Token 與倒數示範，後續需改由後端時間及資料庫紀錄判定。
      </p>
    </div>
  </section>
</template>

<style src="../styles/views/ResetPasswordView.css"></style>

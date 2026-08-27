<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const account = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const email = ref('')
const verificationCode = ref('')
const phone = ref('')
const verificationCooldown = ref(0)
const verificationMessage = ref('')
const registrationMessage = ref('')
const diceRolling = ref(false)

const adjectives = ['可愛', '悠閒', '活潑', '貪睡']
const animals = ['橘貓', '柴犬', '柯基', '兔兔']

let verificationTimer = null
let diceTimer = null

function checkPassword(value) {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  }
}

const passwordChecks = computed(() => checkPassword(password.value))

const passwordRules = computed(() => [
  { key: 'length', label: '至少 8 個字元', passed: passwordChecks.value.length },
  { key: 'upper', label: '包含大寫英文', passed: passwordChecks.value.upper },
  { key: 'lower', label: '包含小寫英文', passed: passwordChecks.value.lower },
  { key: 'number', label: '包含數字', passed: passwordChecks.value.number },
  { key: 'special', label: '包含特殊符號', passed: passwordChecks.value.special },
])

const passwordScore = computed(
  () => passwordRules.value.filter((rule) => rule.passed).length,
)

const passwordStrength = computed(() => {
  if (passwordScore.value <= 2) return { label: '弱', className: 'is-weak' }
  if (passwordScore.value === 3) return { label: '中等', className: 'is-medium' }
  return { label: '強', className: 'is-strong' }
})

const passwordsMatch = computed(
  () => confirmPassword.value.length > 0 && password.value === confirmPassword.value,
)

const verificationButtonText = computed(() => {
  if (verificationCooldown.value === 0) return '寄送驗證碼'
  return `${verificationCooldown.value} 秒後重送`
})

const loginTarget = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return { name: 'login' }
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return { name: 'login' }

  return {
    name: 'login',
    query: { redirect },
  }
})

function clearVerificationTimer() {
  if (verificationTimer === null) return
  window.clearInterval(verificationTimer)
  verificationTimer = null
}

function clearDiceTimer() {
  if (diceTimer === null) return
  window.clearTimeout(diceTimer)
  diceTimer = null
}

function generateNickname() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  const number = Math.floor(Math.random() * 9000) + 1000

  nickname.value = `${adjective}${animal}${number}`
  diceRolling.value = false
  clearDiceTimer()

  window.requestAnimationFrame(() => {
    diceRolling.value = true
    diceTimer = window.setTimeout(() => {
      diceRolling.value = false
      diceTimer = null
    }, 620)
  })
}

function sendVerificationCode() {
  if (verificationCooldown.value > 0) return

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
  if (!validEmail) {
    verificationMessage.value = '請先輸入有效的電子郵件。'
    return
  }

  verificationMessage.value = '驗證碼寄送為頁面示意，目前不會實際寄出郵件。'
  verificationCooldown.value = 60
  clearVerificationTimer()

  verificationTimer = window.setInterval(() => {
    verificationCooldown.value -= 1

    if (verificationCooldown.value <= 0) {
      verificationCooldown.value = 0
      clearVerificationTimer()
    }
  }, 1000)
}

function handleRegister() {
  if (passwordScore.value < 4) {
    registrationMessage.value = '請先將密碼強度提升至「強」。'
    return
  }

  if (!passwordsMatch.value) {
    registrationMessage.value = '兩次輸入的密碼不一致。'
    return
  }

  registrationMessage.value = '註冊資料已完成填寫（頁面示意），目前不會建立帳號。'
}

onBeforeUnmount(() => {
  clearVerificationTimer()
  clearDiceTimer()
})
</script>

<template>
  <section class="register-view" aria-labelledby="register-title">
    <div class="register-card">
      <aside class="register-visual">
        <div class="register-visual-mark" aria-hidden="true">
          <span>🐾</span>
          <i>＋</i>
        </div>
        <p>Join PawPuff</p>
        <h2>一起收藏毛孩的<br />每一段日常</h2>
        <small>建立帳號，開始分享你與毛孩的溫暖故事。</small>
      </aside>

      <form class="register-form" @submit.prevent="handleRegister">
        <div class="register-heading">
          <p>Create account</p>
          <h1 id="register-title">立即註冊</h1>
          <span>填寫以下資料，加入 PawPuff 的毛孩社群。</span>
        </div>

        <div class="register-fields">
          <label class="register-field register-field--full">
            <span>帳號</span>
            <input
              v-model="account"
              type="text"
              autocomplete="username"
              placeholder="請輸入帳號"
              required
            />
          </label>

          <div class="register-field-row">
            <label class="register-field">
              <span>密碼</span>
              <input
                v-model="password"
                type="password"
                autocomplete="new-password"
                placeholder="請輸入密碼"
                required
              />
            </label>

            <label class="register-field">
              <span>確認密碼</span>
              <input
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                placeholder="再次輸入密碼"
                required
              />
              <small
                v-if="confirmPassword"
                class="register-match-message"
                :class="{ 'is-matched': passwordsMatch }"
              >
                {{ passwordsMatch ? '✓ 兩次密碼一致' : '✕ 兩次密碼不一致' }}
              </small>
            </label>
          </div>

          <div class="password-strength" :class="passwordStrength.className" aria-live="polite">
            <div class="password-strength-heading">
              <strong>密碼強度：{{ passwordStrength.label }}</strong>
              <span>{{ passwordScore }} / 5</span>
            </div>
            <div class="password-strength-meter">
              <i :style="{ width: `${passwordScore * 20}%` }"></i>
            </div>
            <ul>
              <li v-for="rule in passwordRules" :key="rule.key" :class="{ 'is-passed': rule.passed }">
                <b>{{ rule.passed ? '✓' : '✕' }}</b>{{ rule.label }}
              </li>
            </ul>
          </div>

          <div class="register-field register-field--full">
            <label for="register-nickname">暱稱</label>
            <span class="register-input-action">
              <input
                id="register-nickname"
                v-model="nickname"
                type="text"
                placeholder="請輸入或隨機產生暱稱"
                required
              />
              <button
                class="nickname-dice"
                :class="{ 'is-rolling': diceRolling }"
                type="button"
                aria-label="隨機產生暱稱"
                title="隨機產生暱稱"
                @click="generateNickname"
              >
                🎲
              </button>
            </span>
          </div>

          <div class="register-field register-field--full">
            <label for="register-email">電子郵件</label>
            <span class="register-input-action register-input-action--email">
              <input
                id="register-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="請輸入電子郵件"
                required
              />
              <button
                type="button"
                class="verification-send"
                :disabled="verificationCooldown > 0"
                @click="sendVerificationCode"
              >
                {{ verificationButtonText }}
              </button>
            </span>
            <small v-if="verificationMessage" class="verification-message" aria-live="polite">
              {{ verificationMessage }}
            </small>
          </div>

          <div class="register-field-row">
            <label class="register-field">
              <span>驗證碼</span>
              <input
                v-model="verificationCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="請輸入驗證碼"
                required
              />
            </label>

            <label class="register-field">
              <span>電話</span>
              <input
                v-model="phone"
                type="tel"
                autocomplete="tel"
                placeholder="請輸入電話"
                required
              />
            </label>
          </div>
        </div>

        <p v-if="registrationMessage" class="register-form-message" aria-live="polite">
          {{ registrationMessage }}
        </p>

        <div class="register-actions">
          <button class="register-submit" type="submit">註冊</button>
          <RouterLink class="register-back" :to="loginTarget">返回登入</RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>

<style src="../styles/views/RegisterView.css"></style>

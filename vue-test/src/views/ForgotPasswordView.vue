<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const email = ref('')
const cooldown = ref(0)
const submitted = ref(false)
let countdownTimer = null

const loginTarget = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return { name: 'login' }
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return { name: 'login' }

  return {
    name: 'login',
    query: { redirect },
  }
})

const submitButtonText = computed(() => {
  if (cooldown.value === 0) return '送出重設連結'
  return `${cooldown.value} 秒後可重新送出`
})

function clearCountdown() {
  if (countdownTimer === null) return
  window.clearInterval(countdownTimer)
  countdownTimer = null
}

function handleSubmit() {
  if (cooldown.value > 0) return

  submitted.value = true
  cooldown.value = 60
  clearCountdown()

  countdownTimer = window.setInterval(() => {
    cooldown.value -= 1

    if (cooldown.value <= 0) {
      cooldown.value = 0
      clearCountdown()
    }
  }, 1000)
}

onBeforeUnmount(clearCountdown)
</script>

<template>
  <section class="forgot-password-view" aria-labelledby="forgot-password-title">
    <div class="forgot-password-card">
      <div class="forgot-password-visual" aria-hidden="true">
        <div class="forgot-password-mark">
          <span>✉</span>
          <b>🐾</b>
        </div>
        <p>找回與毛孩們的每段珍貴回憶</p>
      </div>

      <form class="forgot-password-form" @submit.prevent="handleSubmit">
        <div class="forgot-password-heading">
          <p>Reset password</p>
          <h1 id="forgot-password-title">忘記密碼</h1>
        </div>

        <p class="forgot-password-intro">
          輸入註冊 PawPuff 時使用的 Email，我們會提供密碼重設連結。
        </p>

        <label class="forgot-password-field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="請輸入 Email"
            required
          />
        </label>

        <p v-if="submitted" class="forgot-password-notice" aria-live="polite">
          已收到重設申請（頁面示意），目前不會實際寄出郵件。
        </p>

        <div class="forgot-password-actions">
          <button class="forgot-password-submit" type="submit" :disabled="cooldown > 0">
            {{ submitButtonText }}
          </button>
          <RouterLink class="forgot-password-back" :to="loginTarget">返回登入</RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>

<style src="../styles/views/ForgotPasswordView.css"></style>

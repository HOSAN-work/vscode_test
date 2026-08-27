<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import logo1Url from '../assets/logo1.PNG'

const account = ref('')
const password = ref('')
const route = useRoute()
const router = useRouter()
const { login } = useAuth()
const pawSteps = 7

const forgotPasswordTarget = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return { name: 'forgot-password' }
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return { name: 'forgot-password' }

  return {
    name: 'forgot-password',
    query: { redirect },
  }
})

const registerTarget = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return { name: 'register' }
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return { name: 'register' }

  return {
    name: 'register',
    query: { redirect },
  }
})

function getSafeRedirect() {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return '/'
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/'
  return redirect
}

function handleLogin() {
  login()
  router.replace(getSafeRedirect())
}
</script>

<template>
  <section class="login-view" aria-labelledby="login-title">
    <form class="login-card" @submit.prevent="handleLogin">
      <div class="login-paw-trail login-paw-trail--left" aria-hidden="true">
        <span v-for="index in pawSteps" :key="`left-${index}`" :style="{ '--i': index - 1 }">🐾</span>
      </div>
      <div class="login-paw-trail login-paw-trail--right" aria-hidden="true">
        <span v-for="index in pawSteps" :key="`right-${index}`" :style="{ '--i': index - 1 }">🐾</span>
      </div>

      <div class="login-brand-panel">
        <img :src="logo1Url" alt="PawPuff 噗爪" />
        <p>陪你收藏每一段毛孩日常</p>
      </div>

      <div class="login-form-panel">
        <div class="login-card-heading">
          <p>Welcome back</p>
          <h1 id="login-title">登入 PawPuff</h1>
        </div>
        <p class="login-intro">回來看看毛孩們的最新日常吧！</p>

        <div class="login-fields">
          <label class="login-field">
            <span>帳號</span>
            <input v-model="account" type="text" autocomplete="username" placeholder="請輸入帳號或 Email" />
          </label>

          <label class="login-field">
            <span>密碼</span>
            <input v-model="password" type="password" autocomplete="current-password" placeholder="請輸入密碼" />
          </label>
        </div>

        <div class="login-options">
          <label><input type="checkbox" />記住我</label>
        </div>

        <button class="login-submit" type="submit">登入</button>

        <div class="login-divider"><span>或使用其他方式登入</span></div>

        <div class="login-secondary-actions">
          <div class="social-login-options">
            <button type="button" class="social-login social-login--line" aria-label="使用 LINE 登入">
              <b aria-hidden="true">LINE</b>
            </button>
            <button type="button" class="social-login social-login--google" aria-label="使用 Google 登入">
              <b aria-hidden="true">G</b>
            </button>
          </div>
          <div class="login-text-actions">
            <RouterLink :to="registerTarget">立即註冊</RouterLink>
            <RouterLink :to="forgotPasswordTarget">忘記密碼</RouterLink>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<style src="../styles/views/LoginView.css"></style>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const loginTarget = computed(() => {
  if (route.name === 'login') return { name: 'login' }
  return { name: 'login', query: { redirect: route.fullPath } }
})
</script>

<template>
  <RouterLink class="login-button" :to="loginTarget">
    <svg><use href="#icon-paw" /></svg>
    <span>登入</span>
  </RouterLink>
</template>

<style src="../../styles/components/HeaderLoginButton.css"></style>

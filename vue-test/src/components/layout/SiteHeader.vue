<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import logoUrl from '../../assets/logo2.PNG'
import { useAuth } from '../../composables/useAuth'
import { useCheckIn } from '../../composables/useCheckIn'
import AccountDropdown from '../header/AccountDropdown.vue'
import HeaderAvatar from '../header/HeaderAvatar.vue'
import HeaderLoginButton from '../header/HeaderLoginButton.vue'
import NotificationMenu from '../header/NotificationMenu.vue'

const route = useRoute()
const router = useRouter()
const { isLoggedIn, logout } = useAuth()
const { openCheckIn } = useCheckIn()
const headerElement = ref(null)
const accountOpen = ref(false)
const notificationsOpen = ref(false)
const mobileMenuOpen = ref(false)

const navigation = [
  { label: '首頁', to: '/', icon: 'home' },
  { label: '文章', to: '/articles', icon: 'article' },
  { label: '畫廊', to: '/gallery', icon: 'gallery' },
  { label: '發現', to: '/discover', icon: 'compass' },
  { label: '常見問題', to: '/faq', icon: 'help' },
  { label: '開發團隊', to: '/team', icon: 'team' },
]

function toggleNotifications() {
  notificationsOpen.value = !notificationsOpen.value
  accountOpen.value = false
}

function toggleAccount() {
  accountOpen.value = !accountOpen.value
  notificationsOpen.value = false
}

function closeMenus() {
  accountOpen.value = false
  notificationsOpen.value = false
  mobileMenuOpen.value = false
}

function handleLogout() {
  const protectedRoute = route.meta.requiresAuth ? route.fullPath : null
  logout()
  closeMenus()

  if (protectedRoute) {
    router.replace({
      name: 'login',
      query: { redirect: protectedRoute },
    })
  }
}

function handleOpenCheckIn() {
  closeMenus()
  openCheckIn()
}

function handleDocumentClick(event) {
  if (!headerElement.value?.contains(event.target)) closeMenus()
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeMenus()
}

watch(
  () => route.fullPath,
  () => closeMenus(),
)

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header ref="headerElement" class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="PawPuff 噗爪首頁">
        <img :src="logoUrl" alt="PawPuff 噗爪" />
      </RouterLink>

      <nav
        id="main-nav"
        class="main-nav"
        :class="{ 'is-open': mobileMenuOpen }"
        aria-label="主要導覽"
      >
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          class="nav-link"
          :to="item.to"
          @click="mobileMenuOpen = false"
        >
          <svg><use :href="`#icon-${item.icon}`" /></svg>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="header-actions">
        <NotificationMenu
          v-if="isLoggedIn"
          :open="notificationsOpen"
          @toggle="toggleNotifications"
          @close="notificationsOpen = false"
          @open-check-in="handleOpenCheckIn"
        />

        <div v-if="isLoggedIn" class="account">
          <HeaderAvatar
            :open="accountOpen"
            @toggle="toggleAccount"
          />
          <AccountDropdown
            :open="accountOpen"
            @close="accountOpen = false"
            @open-check-in="handleOpenCheckIn"
            @logout="handleLogout"
          />
        </div>

        <HeaderLoginButton v-if="!isLoggedIn" />

        <button
          class="menu-toggle icon-button"
          type="button"
          :aria-expanded="mobileMenuOpen"
          aria-controls="main-nav"
          :aria-label="mobileMenuOpen ? '關閉導覽選單' : '開啟導覽選單'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg><use :href="mobileMenuOpen ? '#icon-x' : '#icon-menu'" /></svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style src="../../styles/components/SiteHeader.css"></style>

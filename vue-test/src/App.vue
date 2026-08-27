<script setup>
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import CheckInModal from './components/check-in/CheckInModal.vue'
import ChatWidget from './components/common/ChatWidget.vue'
import IconSprite from './components/common/IconSprite.vue'
import ScrollToTop from './components/common/ScrollToTop.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import SiteHeader from './components/layout/SiteHeader.vue'
import { useAuth } from './composables/useAuth'
import { useCheckIn } from './composables/useCheckIn'
import { usePoints } from './composables/usePoints'
import { useToast } from './composables/useToast'

const { isLoggedIn } = useAuth()
const { openDailyCheckIn, closeCheckIn } = useCheckIn()
const { awardDailyLogin } = usePoints()
const { showPointToast } = useToast()

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    openDailyCheckIn()
    const transaction = awardDailyLogin(5)
    if (transaction) showPointToast(transaction.type, transaction.amount)
  } else {
    closeCheckIn()
  }
})
</script>

<template>
  <div class="app-shell">
    <IconSprite />
    <SiteHeader />

    <main class="app-main">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.pageTransition ?? 'route-static'">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <SiteFooter />
    <ChatWidget v-if="isLoggedIn" />
    <CheckInModal />
    <ToastContainer />
    <ScrollToTop />
  </div>
</template>

<style src="./styles/App.css"></style>

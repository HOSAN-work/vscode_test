<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProfileArticlesTab from '../components/profile/ProfileArticlesTab.vue'
import ProfileAvatar from '../components/profile/ProfileAvatar.vue'
import ProfileBio from '../components/profile/ProfileBio.vue'
import ProfileFollowersTab from '../components/profile/ProfileFollowersTab.vue'
import ProfilePaperDollTab from '../components/profile/ProfilePaperDollTab.vue'
import { useProfile } from '../composables/useProfile'

const route = useRoute()
const router = useRouter()
const { currentUserId } = useProfile()
const viewedUserId = computed(() => Number.parseInt(route.params.id ?? '1', 10) || 1)
const isOwnProfile = computed(() => viewedUserId.value === currentUserId.value)

const tabs = Object.freeze([
  { id: 'paper-doll', label: '紙娃娃', icon: 'gallery' },
  { id: 'articles', label: '我的文章', icon: 'article' },
  { id: 'followers', label: '粉絲', icon: 'fan-heart' },
])

const activeTab = ref('paper-doll')
const tabDirection = ref('forward')
const tabTransitionName = computed(() =>
  tabDirection.value === 'forward' ? 'profile-slide-left' : 'profile-slide-right',
)

function setActiveTab(tabId) {
  if (tabId === activeTab.value) return
  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab.value)
  const nextIndex = tabs.findIndex((tab) => tab.id === tabId)
  tabDirection.value = nextIndex > currentIndex ? 'forward' : 'backward'
  activeTab.value = tabId
}

function handleTabKeydown(event, currentIndex) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

  event.preventDefault()
  let nextIndex = currentIndex

  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length
  if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = tabs.length - 1

  const nextTab = tabs[nextIndex]
  setActiveTab(nextTab.id)
  document.getElementById(`profile-tab-${nextTab.id}`)?.focus()
}

function goBack() {
  router.back()
}
</script>

<template>
  <section class="profile-view" aria-label="個人主頁">
    <button
      v-if="!isOwnProfile"
      class="profile-view-back"
      type="button"
      @click="goBack"
    >
      <svg aria-hidden="true"><use href="#icon-arrow-left" /></svg>
      返回
    </button>

    <div class="profile-overview">
      <ProfileAvatar :user-id="viewedUserId" />
      <ProfileBio :user-id="viewedUserId" />
    </div>

    <div class="profile-tabs" role="tablist" aria-label="個人主頁內容">
      <button
        v-for="(tab, index) in tabs"
        :id="`profile-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        :class="{ 'is-active': activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`profile-${tab.id}-panel`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="setActiveTab(tab.id)"
        @keydown="handleTabKeydown($event, index)"
      >
        <svg aria-hidden="true"><use :href="`#icon-${tab.icon}`" /></svg>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div class="profile-tab-content">
      <Transition :name="tabTransitionName" mode="out-in">
        <ProfilePaperDollTab
          v-if="activeTab === 'paper-doll'"
          key="paper-doll"
          :can-edit="isOwnProfile"
          :user-id="viewedUserId"
        />
        <ProfileArticlesTab
          v-else-if="activeTab === 'articles'"
          key="articles"
          :can-edit="isOwnProfile"
          :user-id="viewedUserId"
        />
        <ProfileFollowersTab
          v-else
          key="followers"
          :can-edit="isOwnProfile"
          :user-id="viewedUserId"
        />
      </Transition>
    </div>
  </section>
</template>

<style src="../styles/views/ProfileView.css"></style>

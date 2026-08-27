<script setup>
import { computed, ref } from 'vue'
import ProfileAvatar from '../components/profile/ProfileAvatar.vue'
import ProfileMemberCard from '../components/profile/ProfileMemberCard.vue'
import { useProfile } from '../composables/useProfile'
import {
  getFollowerProfiles,
  getFollowingProfiles,
  getMutualFollowingProfiles,
  unfollowMember,
} from '../data/memberRelationships'
import { memberProfiles } from '../data/memberProfiles'

const { currentUserId, nickname } = useProfile()
const activeTab = ref('followers')
const tabDirection = ref('forward')
const searchQuery = ref('')

const followerProfiles = computed(() => getFollowerProfiles(currentUserId.value))
const followingProfiles = computed(() => getFollowingProfiles(currentUserId.value))
const mutualProfiles = computed(() => getMutualFollowingProfiles(currentUserId.value))
const followerIds = computed(() => new Set(
  followerProfiles.value.map((member) => member.id),
))
const followingIds = computed(() => new Set(
  followingProfiles.value.map((member) => member.id),
))
const relatedIds = computed(() => new Set([...followerIds.value, ...followingIds.value]))

const tabs = computed(() => [
  { id: 'followers', label: '我的粉絲', count: followerProfiles.value.length },
  { id: 'following', label: '我的追蹤', count: followingProfiles.value.length },
  { id: 'mutual', label: '雙向追蹤', count: mutualProfiles.value.length },
])

const activeMembers = computed(() => {
  if (activeTab.value === 'following') return followingProfiles.value
  if (activeTab.value === 'mutual') return mutualProfiles.value
  return followerProfiles.value
})

const listTransitionName = computed(() => (
  tabDirection.value === 'forward'
    ? 'followers-tab-left'
    : 'followers-tab-right'
))

function setActiveTab(tabId) {
  if (tabId === activeTab.value) return

  const currentIndex = tabs.value.findIndex((tab) => tab.id === activeTab.value)
  const nextIndex = tabs.value.findIndex((tab) => tab.id === tabId)
  tabDirection.value = nextIndex > currentIndex ? 'forward' : 'backward'
  activeTab.value = tabId
}

function handleUnfollow(memberId) {
  unfollowMember(currentUserId.value, memberId)
}

const searchableMembers = computed(() => memberProfiles.map((member) => (
  member.id === currentUserId.value ? { ...member, nickname: nickname.value } : member
)))

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('zh-TW')
  if (!query) return []

  const idQuery = query.replace(/^#/, '')
  return searchableMembers.value
    .filter((member) => (
      member.nickname.toLocaleLowerCase('zh-TW').includes(query)
      || String(member.id).includes(idQuery)
    ))
    .sort((left, right) => {
      const leftExactId = String(left.id) === idQuery
      const rightExactId = String(right.id) === idQuery
      if (leftExactId !== rightExactId) return Number(rightExactId) - Number(leftExactId)

      const relatedDifference = Number(relatedIds.value.has(right.id)) - Number(relatedIds.value.has(left.id))
      if (relatedDifference) return relatedDifference

      const leftStartsWith = left.nickname.toLocaleLowerCase('zh-TW').startsWith(query)
      const rightStartsWith = right.nickname.toLocaleLowerCase('zh-TW').startsWith(query)
      if (leftStartsWith !== rightStartsWith) return Number(rightStartsWith) - Number(leftStartsWith)

      return left.id - right.id
    })
    .slice(0, 8)
})
</script>

<template>
  <section class="followers-edit-view" aria-labelledby="followers-edit-title">
    <RouterLink class="followers-edit-back" :to="`/profile/${currentUserId}`">
      <svg aria-hidden="true"><use href="#icon-arrow-left" /></svg>
      返回個人主頁
    </RouterLink>

    <header class="followers-edit-heading">
      <span>PAWPUFF CONNECTIONS</span>
      <h1 id="followers-edit-title">管理追蹤名單</h1>
      <p>查看粉絲與追蹤關係，或搜尋 PawPuff 上的其他會員。</p>
    </header>

    <div class="followers-member-search">
      <label for="followers-member-search-input">搜尋會員</label>
      <div class="followers-member-search-field">
        <svg aria-hidden="true"><use href="#icon-search" /></svg>
        <input
          id="followers-member-search-input"
          v-model="searchQuery"
          type="search"
          autocomplete="off"
          placeholder="輸入暱稱或 #ID"
        />
      </div>

      <div v-if="searchQuery.trim()" class="followers-search-suggestions">
        <RouterLink
          v-for="member in searchResults"
          :key="member.id"
          :to="`/profile/${member.id}`"
          class="followers-search-suggestion"
        >
          <ProfileAvatar :user-id="member.id" variant="suggestion" />
          <strong>{{ member.nickname }} <span>#{{ member.id }}</span></strong>
          <span
            v-if="followerIds.has(member.id) || followingIds.has(member.id)"
            class="followers-search-relations"
          >
            <small v-if="followerIds.has(member.id)" class="is-follower">我的粉絲</small>
            <small v-if="followingIds.has(member.id)" class="is-following">我的追蹤</small>
          </span>
        </RouterLink>
        <p v-if="!searchResults.length" class="followers-search-empty">
          找不到符合「{{ searchQuery.trim() }}」的會員
        </p>
      </div>
    </div>

    <div class="followers-edit-tabs" role="tablist" aria-label="追蹤名單分類">
      <button
        v-for="tab in tabs"
        :id="`followers-edit-tab-${tab.id}`"
        :key="tab.id"
        type="button"
        role="tab"
        :class="{ 'is-active': activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`followers-edit-panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
        <span>{{ tab.count }}</span>
      </button>
    </div>

    <div class="followers-edit-list-stage">
      <Transition :name="listTransitionName" mode="out-in">
        <section
          :id="`followers-edit-panel-${activeTab}`"
          :key="activeTab"
          class="followers-edit-panel"
          role="tabpanel"
          :aria-labelledby="`followers-edit-tab-${activeTab}`"
        >
          <div class="followers-edit-grid">
            <template v-for="member in activeMembers" :key="member.id">
              <ProfileMemberCard
                v-if="activeTab === 'followers'"
                :member="member"
              />
              <div v-else class="followers-edit-action-card">
                <ProfileMemberCard :member="member" />
                <button
                  type="button"
                  :aria-label="`取消追蹤 ${member.nickname} #${member.id}`"
                  @click="handleUnfollow(member.id)"
                >
                  解除追蹤
                </button>
              </div>
            </template>
          </div>
          <p v-if="!activeMembers.length" class="followers-edit-empty">目前還沒有符合此分類的會員。</p>
        </section>
      </Transition>
    </div>
  </section>
</template>

<style src="../styles/views/ProfileFollowersEditView.css"></style>

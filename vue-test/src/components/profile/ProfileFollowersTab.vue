<script setup>
import { computed } from 'vue'
import { useWheelBatchLoading } from '../../composables/useWheelBatchLoading'
import { getFollowerProfiles } from '../../data/memberRelationships'
import ProfileBatchLoader from './ProfileBatchLoader.vue'
import ProfileMemberCard from './ProfileMemberCard.vue'

const props = defineProps({
  canEdit: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: [Number, String],
    required: true,
  },
})

const profileFollowers = computed(() => getFollowerProfiles(props.userId))
const profileFollowerCount = computed(() => profileFollowers.value.length)

const { hasMore, isLoading, loadTrigger, visibleItemCount } = useWheelBatchLoading({
  totalItems: profileFollowerCount,
  initialItems: props.canEdit ? 7 : 8,
  batchSize: 8,
})
const visibleFollowers = computed(() =>
  profileFollowers.value.slice(0, visibleItemCount.value),
)
</script>

<template>
  <section
    id="profile-followers-panel"
    class="profile-followers-panel"
    role="tabpanel"
    aria-labelledby="profile-tab-followers"
  >
    <h2 class="sr-only">粉絲列表</h2>
    <TransitionGroup name="profile-follower-lazy" tag="div" class="profile-follower-grid">
      <RouterLink
        v-if="canEdit"
        key="follower-editor"
        class="profile-member-card profile-follower-edit-card"
        :to="`/profile/${userId}/followers/edit`"
      >
        <svg aria-hidden="true"><use href="#icon-edit" /></svg>
        <strong>管理追蹤名單</strong>
      </RouterLink>
      <ProfileMemberCard
        v-for="follower in visibleFollowers"
        :key="follower.id"
        :member="follower"
      />
    </TransitionGroup>
    <p v-if="!profileFollowers.length && !canEdit" class="profile-followers-empty">
      目前還沒有粉絲。
    </p>
    <div v-if="hasMore" ref="loadTrigger" class="profile-follower-load-trigger">
      <ProfileBatchLoader :active="isLoading" />
    </div>
  </section>
</template>

<style src="../../styles/components/ProfileFollowersTab.css"></style>

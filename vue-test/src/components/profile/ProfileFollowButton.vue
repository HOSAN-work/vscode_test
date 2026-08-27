<script setup>
import { computed } from 'vue'
import { useProfile } from '../../composables/useProfile'
import {
  followMember,
  isFollowingMember,
  unfollowMember,
} from '../../data/memberRelationships'

const props = defineProps({
  targetUserId: {
    type: [Number, String],
    required: true,
  },
})

const { currentUserId } = useProfile()
const normalizedTargetId = computed(() => Number.parseInt(props.targetUserId, 10))
const isFollowing = computed(() => (
  isFollowingMember(currentUserId.value, normalizedTargetId.value)
))

function toggleFollow() {
  if (isFollowing.value) {
    unfollowMember(currentUserId.value, normalizedTargetId.value)
    return
  }

  followMember(currentUserId.value, normalizedTargetId.value)
}
</script>

<template>
  <button
    class="profile-follow-button"
    :class="{ 'is-following': isFollowing }"
    type="button"
    :aria-pressed="isFollowing"
    :aria-label="isFollowing ? '取消追蹤這位會員' : '追蹤這位會員'"
    @click="toggleFollow"
  >
    <svg aria-hidden="true">
      <use :href="isFollowing ? '#icon-x' : '#icon-paw'" />
    </svg>
    <span>{{ isFollowing ? '取消追蹤' : '追蹤' }}</span>
  </button>
</template>

<style src="../../styles/components/ProfileFollowButton.css"></style>

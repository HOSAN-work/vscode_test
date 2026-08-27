<script setup>
import { computed } from 'vue'
import { useProfile } from '../../composables/useProfile'
import { getMemberProfile } from '../../data/memberProfiles'

const props = defineProps({
  userId: {
    type: [Number, String],
    default: 1,
  },
  variant: {
    type: String,
    default: 'profile',
    validator: (value) => ['profile', 'card', 'suggestion'].includes(value),
  },
})

const { currentUserId, nickname } = useProfile()
const member = computed(() => getMemberProfile(props.userId))
const displayedNickname = computed(() =>
  Number(props.userId) === currentUserId.value ? nickname.value : member.value.nickname,
)
</script>

<template>
  <figure class="profile-avatar-card" :class="`profile-avatar-card--${variant}`">
    <img :src="member.image" :alt="`${displayedNickname}的頭像`" />
  </figure>
</template>

<style src="../../styles/components/ProfileAvatar.css"></style>

<script setup>
import { computed } from 'vue'
import { useProfile } from '../../composables/useProfile'
import ProfileAvatar from './ProfileAvatar.vue'

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
})

const { currentUserId, nickname } = useProfile()
const displayedNickname = computed(() =>
  props.member.id === currentUserId.value ? nickname.value : props.member.nickname,
)
</script>

<template>
  <RouterLink
    class="profile-member-card"
    :to="`/profile/${member.id}`"
    :aria-label="`前往 ${displayedNickname} #${member.id} 的個人主頁`"
  >
    <ProfileAvatar :user-id="member.id" variant="card" />
    <div class="profile-member-card-name">
      <strong>{{ displayedNickname }} <span>#{{ member.id }}</span></strong>
    </div>
  </RouterLink>
</template>

<style src="../../styles/components/ProfileMemberCard.css"></style>

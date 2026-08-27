<script setup>
import { computed } from 'vue'
import { useProfile } from '../../composables/useProfile'
import { getMemberProfile } from '../../data/memberProfiles'
import EditProfileModal from './EditProfileModal.vue'
import ProfileFollowButton from './ProfileFollowButton.vue'

const props = defineProps({
  userId: {
    type: [Number, String],
    default: 1,
  },
})

const { currentUserId, nickname, introduction } = useProfile()
const member = computed(() => getMemberProfile(props.userId))
const isOwnProfile = computed(() => Number(props.userId) === currentUserId.value)
const displayedNickname = computed(() =>
  isOwnProfile.value ? nickname.value : member.value.nickname,
)
const displayedIntroduction = computed(() =>
  isOwnProfile.value ? introduction.value : member.value.introduction,
)
</script>

<template>
  <section class="profile-bio" aria-labelledby="profile-nickname">
    <div class="profile-bio-heading">
      <div>
        <span>PAWPUFF MEMBER</span>
        <h1 id="profile-nickname">
          {{ displayedNickname }} <span class="profile-bio-id">#{{ member.id }}</span>
        </h1>
      </div>
      <EditProfileModal v-if="isOwnProfile" />
      <ProfileFollowButton v-else :target-user-id="member.id" />
    </div>

    <div class="profile-bio-introduction">
      <strong>個人簡介</strong>
      <p>{{ displayedIntroduction }} <span aria-hidden="true">🐾</span></p>
    </div>
  </section>
</template>

<style src="../../styles/components/ProfileBio.css"></style>

<script setup>
import { useProfile } from '../../composables/useProfile'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])

const { nickname } = useProfile()
const avatarImageUrl =
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=120&q=80'
</script>

<template>
  <button
    class="account-trigger"
    type="button"
    :aria-expanded="open"
    aria-controls="account-menu"
    @click="$emit('toggle')"
  >
    <img :src="avatarImageUrl" :alt="`會員${nickname}的頭像`" />
  </button>
</template>

<style src="../../styles/components/HeaderAvatar.css"></style>

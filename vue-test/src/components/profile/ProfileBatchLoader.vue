<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Transition name="profile-batch-loader-fade">
    <div
      v-if="active"
      class="profile-batch-loader"
      role="status"
      aria-live="polite"
      aria-label="正在載入更多內容"
    >
      <span v-for="dot in 3" :key="dot" aria-hidden="true"></span>
      <span class="sr-only">載入中...</span>
    </div>
  </Transition>
</template>

<style src="../../styles/components/ProfileBatchLoader.css"></style>

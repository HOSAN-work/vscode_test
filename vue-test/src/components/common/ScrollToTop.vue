<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isVisible = ref(false)

function updateVisibility() {
  isVisible.value = window.scrollY > 1
}

function scrollToPageTop() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    window.requestAnimationFrame(updateVisibility)
  },
)

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<template>
  <Transition name="scroll-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="scroll-to-top-button"
      aria-label="回到頁面頂端"
      title="回到頁面頂端"
      @click="scrollToPageTop"
    >
      <svg aria-hidden="true"><use href="#icon-arrow-up" /></svg>
    </button>
  </Transition>
</template>

<style src="../../styles/components/ScrollToTop.css"></style>

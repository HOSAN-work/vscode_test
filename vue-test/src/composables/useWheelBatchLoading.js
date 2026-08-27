import { computed, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'

export function useWheelBatchLoading({
  totalItems,
  initialItems,
  batchSize,
  loadingDelay = 900,
}) {
  const totalItemCount = computed(() => Math.max(0, Number(unref(totalItems)) || 0))
  const visibleItemCount = ref(Math.min(initialItems, totalItemCount.value))
  const loadTrigger = ref(null)
  const isLoading = ref(false)
  const hasMore = computed(() => visibleItemCount.value < totalItemCount.value)
  let frameId = null
  let loadingTimer = null
  let unlockTimer = null
  let loadingLocked = false

  function appendNextBatch() {
    if (!hasMore.value || loadingLocked) return

    loadingLocked = true
    isLoading.value = true
    window.clearTimeout(loadingTimer)
    loadingTimer = window.setTimeout(() => {
      visibleItemCount.value = Math.min(
        visibleItemCount.value + batchSize,
        totalItemCount.value,
      )
      isLoading.value = false
      loadingTimer = null

      window.clearTimeout(unlockTimer)
      unlockTimer = window.setTimeout(() => {
        loadingLocked = false
        unlockTimer = null
      }, 240)
    }, loadingDelay)
  }

  function handleWheel(event) {
    if (event.deltaY <= 0 || !hasMore.value || loadingLocked) return

    if (frameId !== null) window.cancelAnimationFrame(frameId)
    frameId = window.requestAnimationFrame(() => {
      frameId = null
      const trigger = loadTrigger.value
      if (!trigger) return

      const triggerPosition = trigger.getBoundingClientRect()
      const isApproachingBottom = triggerPosition.top <= window.innerHeight + 120
      if (isApproachingBottom) appendNextBatch()
    })
  }

  onMounted(() => window.addEventListener('wheel', handleWheel, { passive: true }))

  watch(totalItemCount, (nextTotal, previousTotal) => {
    if (nextTotal < visibleItemCount.value) {
      visibleItemCount.value = nextTotal
      return
    }

    if (nextTotal > previousTotal && visibleItemCount.value >= previousTotal) {
      visibleItemCount.value = Math.min(nextTotal, Math.max(initialItems, visibleItemCount.value))
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('wheel', handleWheel)
    if (frameId !== null) window.cancelAnimationFrame(frameId)
    window.clearTimeout(loadingTimer)
    window.clearTimeout(unlockTimer)
  })

  return {
    hasMore,
    isLoading,
    loadTrigger,
    visibleItemCount,
  }
}

<script setup>
import { useToast } from '../../composables/useToast'

const { toasts, dismissToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="point-toast-stack" aria-live="polite" aria-label="點數通知">
      <TransitionGroup name="point-toast">
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="point-toast-card"
          :class="`is-${toast.tone}`"
          :style="{ '--toast-duration': `${toast.duration}ms` }"
          role="status"
        >
          <div class="point-toast-icon" aria-hidden="true">
            <span>🪙</span>
            <i>🐾</i>
          </div>

          <div class="point-toast-copy">
            <small>PawPuff Points</small>
            <strong>{{ toast.title }}</strong>
            <p>點數 <b>{{ toast.pointDelta }}</b></p>
          </div>

          <button type="button" aria-label="關閉點數通知" @click="dismissToast(toast.id)">
            <svg><use href="#icon-x" /></svg>
          </button>
          <i class="point-toast-progress" aria-hidden="true"></i>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style src="../../styles/components/ToastContainer.css"></style>

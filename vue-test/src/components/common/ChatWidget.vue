<script setup>
import { nextTick, ref } from 'vue'

const isOpen = ref(false)
const input = ref('')
const inputElement = ref(null)
const chatBody = ref(null)
const messages = ref([
  {
    id: 1,
    text: '嗨！今天想和我們分享哪一段毛孩日常呢？ 🐾',
    fromUser: false,
  },
])

async function toggleChat(force) {
  isOpen.value = force ?? !isOpen.value
  if (isOpen.value) {
    await nextTick()
    inputElement.value?.focus()
  }
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text) return

  messages.value.push({ id: Date.now(), text, fromUser: true })
  input.value = ''
  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
}
</script>

<template>
  <button
    class="chat-launcher"
    type="button"
    :aria-expanded="isOpen"
    aria-controls="chat-panel"
    @click="toggleChat()"
  >
    <svg><use href="#icon-message" /></svg>
    <span>聊天室</span>
    <i aria-hidden="true"></i>
  </button>

  <aside
    id="chat-panel"
    class="chat-panel"
    :class="{ 'is-open': isOpen }"
    :aria-hidden="!isOpen"
  >
    <div class="chat-header">
      <div>
        <span>🐶</span>
        <div>
          <strong>PawPuff 小幫手</strong>
          <small>通常會立即回覆</small>
        </div>
      </div>
      <button type="button" class="chat-close" aria-label="關閉聊天室" @click="toggleChat(false)">
        <svg><use href="#icon-x" /></svg>
      </button>
    </div>

    <div ref="chatBody" class="chat-body" aria-live="polite">
      <p v-for="message in messages" :key="message.id" :class="{ 'is-user': message.fromUser }">
        {{ message.text }}
      </p>
    </div>

    <form class="chat-form" @submit.prevent="sendMessage">
      <label class="sr-only" for="chat-input">輸入訊息</label>
      <input
        id="chat-input"
        ref="inputElement"
        v-model="input"
        type="text"
        placeholder="輸入訊息⋯"
        autocomplete="off"
      />
      <button type="submit" aria-label="傳送訊息">
        <svg><use href="#icon-send" /></svg>
      </button>
    </form>
  </aside>
</template>

<style src="../../styles/components/ChatWidget.css"></style>

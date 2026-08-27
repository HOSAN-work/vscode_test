<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useProfile } from '../../composables/useProfile'

const { nickname, introduction, email, updateProfile } = useProfile()
const isOpen = ref(false)
const draftNickname = ref('')
const draftIntroduction = ref('')
const draftEmail = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const cooldown = ref(0)
const codeSent = ref(false)
const formError = ref('')
let cooldownTimer = null

function openModal() {
  draftNickname.value = nickname.value
  draftIntroduction.value = introduction.value
  draftEmail.value = email.value
  verificationCode.value = ''
  password.value = ''
  confirmPassword.value = ''
  codeSent.value = false
  formError.value = ''
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
  formError.value = ''
}

function sendVerificationCode() {
  if (cooldown.value || !draftEmail.value.trim()) {
    if (!draftEmail.value.trim()) formError.value = '請先輸入電子郵件。'
    return
  }

  formError.value = ''
  codeSent.value = true
  cooldown.value = 60
  window.clearInterval(cooldownTimer)
  cooldownTimer = window.setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) {
      cooldown.value = 0
      window.clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

function saveProfile() {
  if (!draftNickname.value.trim() || !draftIntroduction.value.trim()) {
    formError.value = '暱稱與個人簡介不可留白。'
    return
  }

  if (password.value || confirmPassword.value || verificationCode.value) {
    if (!codeSent.value || !verificationCode.value.trim()) {
      formError.value = '修改密碼前，請先寄送並填寫電子郵件驗證碼。'
      return
    }
    if (password.value.length < 8) {
      formError.value = '新密碼至少需要 8 個字元。'
      return
    }
    if (password.value !== confirmPassword.value) {
      formError.value = '兩次輸入的密碼不一致。'
      return
    }
  }

  updateProfile({
    nickname: draftNickname.value,
    introduction: draftIntroduction.value,
    email: draftEmail.value,
  })
  closeModal()
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeModal()
}

watch(isOpen, (open) => {
  document.body.classList.toggle('has-profile-modal', open)
})

onBeforeUnmount(() => {
  document.body.classList.remove('has-profile-modal')
  window.clearInterval(cooldownTimer)
})
</script>

<template>
  <button
    class="edit-profile-trigger"
    type="button"
    aria-label="編輯個人資料"
    title="編輯個人資料"
    @click="openModal"
  >
    <svg aria-hidden="true"><use href="#icon-edit" /></svg>
  </button>

  <Teleport to="body">
    <Transition name="profile-modal">
      <div
        v-if="isOpen"
        class="edit-profile-backdrop"
        role="presentation"
        @mousedown.self="closeModal"
        @keydown="handleKeydown"
      >
        <section
          class="edit-profile-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
        >
          <header>
            <div>
              <span>PAWPUFF MEMBER</span>
              <h2 id="edit-profile-title">編輯個人資料</h2>
            </div>
            <button type="button" aria-label="關閉編輯個人資料" @click="closeModal">
              <svg aria-hidden="true"><use href="#icon-x" /></svg>
            </button>
          </header>

          <form @submit.prevent="saveProfile">
            <label class="edit-profile-field">
              <span>暱稱</span>
              <input v-model="draftNickname" type="text" maxlength="24" autocomplete="nickname" />
            </label>

            <label class="edit-profile-field">
              <span>個人簡介</span>
              <textarea v-model="draftIntroduction" rows="4" maxlength="180" />
              <small>{{ draftIntroduction.length }} / 180</small>
            </label>

            <div class="edit-profile-divider">
              <span>需要修改密碼時填寫</span>
            </div>

            <div class="edit-profile-email-row">
              <label class="edit-profile-field">
                <span>電子郵件</span>
                <input v-model="draftEmail" type="email" autocomplete="email" />
              </label>
              <button type="button" :disabled="cooldown > 0" @click="sendVerificationCode">
                {{ cooldown > 0 ? `${cooldown} 秒後重寄` : '寄送驗證信' }}
              </button>
            </div>
            <p v-if="codeSent" class="edit-profile-code-hint">驗證信已寄出（目前為前端畫面示意）</p>

            <div class="edit-profile-password-grid">
              <label class="edit-profile-field">
                <span>驗證碼</span>
                <input v-model="verificationCode" type="text" inputmode="numeric" autocomplete="one-time-code" />
              </label>
              <label class="edit-profile-field">
                <span>新密碼</span>
                <input v-model="password" type="password" autocomplete="new-password" />
              </label>
              <label class="edit-profile-field">
                <span>確認新密碼</span>
                <input v-model="confirmPassword" type="password" autocomplete="new-password" />
              </label>
            </div>

            <p v-if="formError" class="edit-profile-error" role="alert">{{ formError }}</p>

            <footer>
              <button type="button" class="is-secondary" @click="closeModal">取消</button>
              <button type="submit" class="is-primary">儲存修改</button>
            </footer>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style src="../../styles/components/EditProfileModal.css"></style>

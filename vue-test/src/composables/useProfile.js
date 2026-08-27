import { readonly, ref } from 'vue'

const nickname = ref('噗噗麻')
const introduction = ref(
  '毛孩是我生活的陽光！喜歡分享日常、訓練心得與各種實用小知識，希望能和大家一起讓毛孩快樂健康地長大。',
)
const email = ref('pawpuff@example.com')
const currentUserId = ref(1)

export function useProfile() {
  function updateProfile(profile) {
    const nextNickname = profile.nickname?.trim()
    const nextIntroduction = profile.introduction?.trim()
    const nextEmail = profile.email?.trim()

    if (nextNickname) nickname.value = nextNickname
    if (nextIntroduction) introduction.value = nextIntroduction
    if (nextEmail) email.value = nextEmail
  }

  return {
    nickname: readonly(nickname),
    introduction: readonly(introduction),
    email: readonly(email),
    currentUserId: readonly(currentUserId),
    updateProfile,
  }
}

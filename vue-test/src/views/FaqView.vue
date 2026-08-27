<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const categories = [
  {
    id: 'account',
    label: '帳號',
    icon: '人',
    questions: [
      {
        id: 'register',
        question: '如何註冊 PawPuff 帳號？',
        answer:
          '點選頁面右上角的「登入」，再選擇「立即註冊」，依序填寫帳號、密碼、暱稱、電子郵件與電話即可完成註冊。',
      },
      {
        id: 'forgot-password',
        question: '忘記密碼時該怎麼辦？',
        answer:
          '請在登入頁點選「忘記密碼」，輸入註冊時使用的電子郵件，我們會寄送密碼重設連結供你設定新密碼。',
      },
    ],
  },
  {
    id: 'articles',
    label: '文章',
    icon: '文',
    questions: [
      {
        id: 'publish',
        question: '如何發布一篇新文章？',
        answer:
          '登入後進入文章頁面，點選「發表文章」，填寫標題、內文並選擇適合的分類與圖片，確認內容後即可發布。',
      },
      {
        id: 'manage-post',
        question: '發布後可以編輯或刪除文章嗎？',
        answer:
          '可以。進入個人主頁找到自己的文章，即可使用文章選單進行編輯或刪除；刪除後的內容將無法復原。',
      },
    ],
  },
  {
    id: 'shop',
    label: '商城',
    icon: '商',
    questions: [
      {
        id: 'purchase',
        question: '如何在點數商城購買商品？',
        answer:
          '登入後前往點數商城，選擇想要的商品並確認兌換。系統會顯示所需點數，完成後將自動扣除相應點數。',
      },
      {
        id: 'orders',
        question: '在哪裡查看已兌換的商品？',
        answer:
          '可於個人主頁的「兌換紀錄」查看商品、兌換時間與使用狀態；紙娃娃類商品則會同步出現在造型收藏中。',
      },
    ],
  },
  {
    id: 'points',
    label: '點數',
    icon: '點',
    questions: [
      {
        id: 'earn',
        question: 'PawPuff 點數要如何獲得？',
        answer:
          '每日首次登入、發文、留言與按讚都能取得點數，參與限定活動或贊助平台也可能獲得額外點數獎勵。',
      },
      {
        id: 'expiry',
        question: '點數會過期或可以轉讓嗎？',
        answer:
          '目前一般點數沒有使用期限，也無法轉讓給其他帳號；若為活動限定點數，期限會另外標示於活動說明中。',
      },
    ],
  },
  {
    id: 'avatar',
    label: '紙娃娃',
    icon: '偶',
    questions: [
      {
        id: 'customize',
        question: '如何更換紙娃娃的造型？',
        answer:
          '登入後進入個人主頁的紙娃娃編輯區，從已擁有的服裝與配件中選擇造型，預覽完成後按下儲存即可套用。',
      },
      {
        id: 'items',
        question: '新的服裝和配件要去哪裡取得？',
        answer:
          '可於點數商城使用點數兌換，也能透過每日簽到、期間活動或特殊任務取得限定紙娃娃素材。',
      },
    ],
  },
  {
    id: 'service',
    label: '客服',
    icon: '訊',
    questions: [
      {
        id: 'contact',
        question: '遇到問題時如何聯絡客服？',
        answer:
          '登入後可點選頁面右下角的聊天氣泡，選擇客服聊天室並留下問題內容；也可以透過網站聯絡表單送出需求。',
      },
      {
        id: 'response-time',
        question: '客服通常需要多久回覆？',
        answer:
          '一般問題預計於一至兩個工作日內回覆。若遇例假日、活動期間或需要進一步查證，處理時間可能稍微延長。',
      },
    ],
  },
]

const keyword = ref('')
const activeCategory = ref(categories[0].id)
const openItems = ref(new Set())

const normalizedKeyword = computed(() => keyword.value.trim().toLocaleLowerCase('zh-TW'))

const filteredCategories = computed(() => {
  if (!normalizedKeyword.value) return categories

  return categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((item) =>
        `${item.question} ${item.answer}`
          .toLocaleLowerCase('zh-TW')
          .includes(normalizedKeyword.value),
      ),
    }))
    .filter((category) => category.questions.length)
})

const resultCount = computed(() =>
  filteredCategories.value.reduce((total, category) => total + category.questions.length, 0),
)

const searchKeyword = computed({
  get: () => keyword.value,
  set: (value) => {
    keyword.value = value
    nextTick(() => {
      activeCategory.value = filteredCategories.value[0]?.id ?? ''
    })
  },
})

function includesKeyword(text) {
  return Boolean(
    normalizedKeyword.value &&
      text.toLocaleLowerCase('zh-TW').includes(normalizedKeyword.value),
  )
}

function isAnswerVisible(categoryId, item) {
  return openItems.value.has(itemId(categoryId, item.id)) || includesKeyword(item.answer)
}

function highlightSegments(text) {
  const searchTerm = normalizedKeyword.value

  if (!searchTerm) return [{ text, isMatch: false }]

  const normalizedText = text.toLocaleLowerCase('zh-TW')
  const segments = []
  let cursor = 0
  let matchIndex = normalizedText.indexOf(searchTerm, cursor)

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      segments.push({ text: text.slice(cursor, matchIndex), isMatch: false })
    }

    segments.push({
      text: text.slice(matchIndex, matchIndex + searchTerm.length),
      isMatch: true,
    })

    cursor = matchIndex + searchTerm.length
    matchIndex = normalizedText.indexOf(searchTerm, cursor)
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false })
  }

  return segments.length ? segments : [{ text, isMatch: false }]
}

function itemId(categoryId, questionId) {
  return `${categoryId}-${questionId}`
}

function toggleAnswer(id) {
  const nextItems = new Set(openItems.value)

  if (nextItems.has(id)) {
    nextItems.delete(id)
  } else {
    nextItems.add(id)
  }

  openItems.value = nextItems
}

async function jumpToCategory(categoryId) {
  keyword.value = ''
  await nextTick()

  const target = document.getElementById(`faq-${categoryId}`)
  if (!target) return

  activeCategory.value = categoryId
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function clearSearch() {
  searchKeyword.value = ''
}

function handlePageScroll() {
  if (!filteredCategories.value.length) return

  const threshold = 120
  let currentCategory = filteredCategories.value[0].id

  filteredCategories.value.forEach((category) => {
    const section = document.getElementById(`faq-${category.id}`)
    if (section && section.getBoundingClientRect().top <= threshold) {
      currentCategory = category.id
    }
  })

  activeCategory.value = currentCategory
}

onMounted(() => window.addEventListener('scroll', handlePageScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', handlePageScroll))
</script>

<template>
  <section class="faq-view" aria-label="常見問題">
    <div class="faq-layout">
      <aside class="faq-sidebar" aria-label="常見問題篩選與分類">
        <label class="faq-search">
          <span>關鍵字搜尋</span>
          <span class="faq-search__field">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5"></circle>
              <path d="m16 16 4 4"></path>
            </svg>
            <input
              v-model="searchKeyword"
              type="search"
              placeholder="搜尋問題或答案"
              autocomplete="off"
            />
            <button v-if="keyword" type="button" aria-label="清除搜尋內容" @click="clearSearch">
              ×
            </button>
          </span>
        </label>

        <p v-if="normalizedKeyword" class="faq-result-summary" aria-live="polite">
          找到 <strong>{{ resultCount }}</strong> 個相關問題
        </p>

        <nav class="faq-category-nav" aria-label="問題分類">
          <h2>問題分類</h2>
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            :class="{ 'is-active': activeCategory === category.id }"
            :aria-current="activeCategory === category.id ? 'true' : undefined"
            @click="jumpToCategory(category.id)"
          >
            <span>{{ category.label }}</span>
            <small>{{ category.questions.length }}</small>
          </button>
        </nav>
      </aside>

      <div
        class="faq-question-pane"
        role="region"
        aria-label="問答內容"
      >
        <div v-if="filteredCategories.length" class="faq-category-list">
          <section
            v-for="category in filteredCategories"
            :id="`faq-${category.id}`"
            :key="category.id"
            class="faq-category"
            tabindex="-1"
          >
            <header class="faq-category__heading">
              <span aria-hidden="true">{{ category.icon }}</span>
              <div>
                <small>Category</small>
                <h2>{{ category.label }}</h2>
              </div>
              <b>{{ category.questions.length }} Questions</b>
            </header>

            <div class="faq-question-list">
              <article
                v-for="item in category.questions"
                :key="item.id"
                class="faq-question"
                :class="{ 'is-open': isAnswerVisible(category.id, item) }"
              >
                <h3>
                  <button
                    type="button"
                    :aria-expanded="isAnswerVisible(category.id, item)"
                    :aria-controls="`faq-answer-${itemId(category.id, item.id)}`"
                    @click="toggleAnswer(itemId(category.id, item.id))"
                  >
                    <span>
                      <template
                        v-for="(segment, segmentIndex) in highlightSegments(item.question)"
                        :key="`${segment.text}-${segmentIndex}`"
                      >
                        <mark v-if="segment.isMatch" class="faq-match">{{ segment.text }}</mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </span>
                    <i aria-hidden="true"></i>
                  </button>
                </h3>

                <Transition name="faq-answer">
                  <div
                    v-if="isAnswerVisible(category.id, item)"
                    :id="`faq-answer-${itemId(category.id, item.id)}`"
                    class="faq-question__answer"
                  >
                    <p>
                      <template
                        v-for="(segment, segmentIndex) in highlightSegments(item.answer)"
                        :key="`${segment.text}-${segmentIndex}`"
                      >
                        <mark v-if="segment.isMatch" class="faq-match">{{ segment.text }}</mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </p>
                  </div>
                </Transition>
              </article>
            </div>
          </section>
        </div>

        <div v-else class="faq-empty" role="status">
          <span aria-hidden="true">?</span>
          <h2>沒有找到相符的問題</h2>
          <p>請嘗試其他關鍵字，或清除搜尋後瀏覽所有分類。</p>
          <button type="button" @click="clearSearch">清除搜尋</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style src="../styles/views/FaqView.css"></style>

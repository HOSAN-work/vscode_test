<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const heroSlides = [
  {
    kicker: '分享毛孩日常',
    title: '讓 <em>愛</em> 被看見',
    description: '記錄、交流、陪伴每一段毛孩時光',
    image:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1800&q=88',
    position: 'center 52%',
  },
  {
    kicker: '收藏幸福瞬間',
    title: '把 <em>喜歡</em> 留下來',
    description: '每張照片，都是你們一起生活的證明',
    image:
      'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1800&q=88',
    position: 'center 48%',
  },
  {
    kicker: '遇見同好夥伴',
    title: '讓 <em>陪伴</em> 更靠近',
    description: '在溫暖社群裡，交換彼此的養寵靈感',
    image:
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=1800&q=88',
    position: 'center 42%',
  },
  {
    kicker: '探索更多樂趣',
    title: '和 <em>毛孩</em> 去冒險',
    description: '發現友善景點、知識與生活新提案',
    image:
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1800&q=88',
    position: 'center 52%',
  },
]

const announcements = [
  {
    title: '春日出遊攝影活動開跑！',
    route: '/gallery',
    summary: '分享春日毛孩美照，贏取限量好禮！',
    date: '2025.05.15',
    image:
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=84',
    doodle: '☀',
  },
  {
    title: '貓咪行為小知識分享',
    route: '/articles',
    summary: '了解貓咪行為，增進彼此的幸福感。',
    date: '2025.05.10',
    image:
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=84',
    doodle: '♡',
  },
  {
    title: '噗爪社群規則更新公告',
    route: '/faq',
    summary: '一起維護友善環境，讓社群更美好！',
    date: '2025.05.05',
    image:
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=800&q=84',
    doodle: '✦',
  },
  {
    title: '新功能上線：畫廊分類',
    route: '/gallery',
    summary: '更方便的分類瀏覽，快來體驗吧！',
    date: '2025.04.28',
    image:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=84',
    doodle: '✧',
  },
  {
    title: '毛孩健康講座開放報名',
    route: '/discover',
    summary: '獸醫師線上解答，陪毛孩健康長大。',
    date: '2025.04.20',
    image:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=84',
    doodle: '♧',
  },
]

const heroIndex = ref(0)
const isHeroChanging = ref(false)
const announcementIndex = ref(0)
const visibleAnnouncementCount = ref(4)
const announcementTranslation = ref(0)
const announcementViewport = ref(null)
let heroTimer
let heroTransitionTimer

const currentHero = computed(() => heroSlides[heroIndex.value])
const announcementPageCount = computed(() =>
  Math.max(1, announcements.length - visibleAnnouncementCount.value + 1),
)

function selectHero(index, restart = true) {
  window.clearTimeout(heroTransitionTimer)
  isHeroChanging.value = true
  heroIndex.value = (index + heroSlides.length) % heroSlides.length
  heroTransitionTimer = window.setTimeout(() => {
    isHeroChanging.value = false
  }, 300)
  if (restart) restartHeroTimer()
}

function stepHero(direction) {
  selectHero(heroIndex.value + direction)
}

function restartHeroTimer() {
  window.clearInterval(heroTimer)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroTimer = window.setInterval(() => selectHero(heroIndex.value + 1, false), 6500)
  }
}

function getVisibleCount() {
  if (window.innerWidth <= 650) return 1
  if (window.innerWidth <= 980) return 2
  return 4
}

function getAnnouncementGap() {
  return window.innerWidth <= 650 ? 14 : 22
}

function updateAnnouncementCarousel(index = announcementIndex.value) {
  const viewport = announcementViewport.value
  if (!viewport) return

  visibleAnnouncementCount.value = getVisibleCount()
  const maxIndex = Math.max(0, announcements.length - visibleAnnouncementCount.value)
  announcementIndex.value = Math.min(Math.max(index, 0), maxIndex)

  const gap = getAnnouncementGap()
  const cardWidth =
    (viewport.clientWidth - gap * (visibleAnnouncementCount.value - 1)) /
    visibleAnnouncementCount.value
  announcementTranslation.value = announcementIndex.value * (cardWidth + gap)
}

function stepAnnouncements(direction) {
  const maxIndex = Math.max(0, announcements.length - visibleAnnouncementCount.value)
  const nextIndex = announcementIndex.value + direction
  if (nextIndex < 0) updateAnnouncementCarousel(maxIndex)
  else if (nextIndex > maxIndex) updateAnnouncementCarousel(0)
  else updateAnnouncementCarousel(nextIndex)
}

async function handleResize() {
  await nextTick()
  updateAnnouncementCarousel()
}

onMounted(() => {
  restartHeroTimer()
  updateAnnouncementCarousel(0)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.clearInterval(heroTimer)
  window.clearTimeout(heroTransitionTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="home-view">
    <section
      class="hero"
      :class="{ 'is-changing': isHeroChanging }"
      aria-label="PawPuff 精選內容"
    >
      <div
        class="hero-media"
        aria-hidden="true"
        :style="{
          backgroundImage: `url(${currentHero.image})`,
          backgroundPosition: currentHero.position,
        }"
      ></div>
      <div class="hero-wash" aria-hidden="true"></div>

      <div class="hero-content">
        <span class="hero-paw" aria-hidden="true">🐾</span>
        <p class="hero-kicker">{{ currentHero.kicker }}</p>
        <h1 v-html="currentHero.title"></h1>
        <p class="hero-description">{{ currentHero.description }}</p>
      </div>

      <button class="hero-arrow hero-arrow--prev" type="button" aria-label="上一張主視覺" @click="stepHero(-1)">
        <svg><use href="#icon-arrow-left" /></svg>
      </button>
      <button class="hero-arrow hero-arrow--next" type="button" aria-label="下一張主視覺" @click="stepHero(1)">
        <svg><use href="#icon-chevron" /></svg>
      </button>

      <div class="hero-dots" role="tablist" aria-label="主視覺頁次">
        <button
          v-for="(_, index) in heroSlides"
          :key="index"
          type="button"
          role="tab"
          :class="{ 'is-active': heroIndex === index }"
          :aria-label="`前往第 ${index + 1} 頁`"
          :aria-selected="heroIndex === index"
          @click="selectHero(index)"
        ></button>
      </div>
    </section>

    <div class="site-shell">
      <section class="announcements" aria-labelledby="announcement-title">
        <div class="section-heading">
          <div class="heading-title">
            <svg><use href="#icon-megaphone" /></svg>
            <h2 id="announcement-title">最新公告</h2>
            <span class="heading-rays" aria-hidden="true"><br></span>
          </div>
        </div>

        <button
          type="button"
          class="announcement-side announcement-side--prev"
          aria-label="上一則公告"
          @click="stepAnnouncements(-1)"
        >
          <svg><use href="#icon-arrow-left" /></svg>
        </button>
        <button
          type="button"
          class="announcement-side announcement-side--next"
          aria-label="下一則公告"
          @click="stepAnnouncements(1)"
        >
          <svg><use href="#icon-chevron" /></svg>
        </button>

        <div ref="announcementViewport" class="announcement-viewport">
          <div
            class="announcement-track"
            :style="{ transform: `translateX(-${announcementTranslation}px)` }"
          >
            <RouterLink
              v-for="item in announcements"
              :key="item.title"
              class="announcement-card"
              :to="item.route"
            >
              <div class="card-image">
                <img :src="item.image" :alt="item.title" loading="lazy" />
                <span class="card-doodle" aria-hidden="true">{{ item.doodle }}</span>
              </div>
              <div class="card-copy">
                <h3>{{ item.title }}</h3>
                <p>{{ item.summary }}</p>
                <div class="card-meta">
                  <time :datetime="item.date.replaceAll('.', '-')">{{ item.date }}</time>
                  <span aria-hidden="true">🐾</span>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="announcement-dots" role="tablist" aria-label="公告頁次">
          <button
            v-for="index in announcementPageCount"
            :key="index"
            type="button"
            role="tab"
            :class="{ 'is-active': announcementIndex === index - 1 }"
            :aria-label="`前往第 ${index} 頁`"
            :aria-selected="announcementIndex === index - 1"
            @click="updateAnnouncementCarousel(index - 1)"
          ></button>
        </div>
      </section>
    </div>
  </div>
</template>

<style src="../styles/views/HomeView.css"></style>

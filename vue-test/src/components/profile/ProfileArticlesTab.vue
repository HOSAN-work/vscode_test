<script setup>
import { computed } from 'vue'
import { useWheelBatchLoading } from '../../composables/useWheelBatchLoading'
import ProfileBatchLoader from './ProfileBatchLoader.vue'

const props = defineProps({
  canEdit: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: [Number, String],
    required: true,
  },
})

const baseArticles = Object.freeze([
  {
    id: 1,
    category: '醫療養護',
    tone: 'care',
    title: '毛孩定期健康檢查的重要性',
    likes: 256,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 2,
    category: '飲食營養',
    tone: 'food',
    title: '自製狗狗鮮食的 5 個營養搭配技巧',
    likes: 274,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 3,
    category: '行為訓練',
    tone: 'training',
    title: '教會狗狗「握手」的 3 個簡單步驟',
    likes: 259,
    image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 4,
    category: '美容美體',
    tone: 'beauty',
    title: '在家幫毛孩美容的 5 個小技巧',
    likes: 123,
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 5,
    category: '走失求助',
    tone: 'rescue',
    title: '毛孩走失怎麼辦？快速找回的 4 個步驟',
    likes: 118,
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 6,
    category: '醫療養護',
    tone: 'care',
    title: '貓咪不愛喝水？5 招提升飲水量',
    likes: 153,
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 7,
    category: '飲食營養',
    tone: 'food',
    title: '改善狗狗亂咬東西的實用訓練方法',
    likes: 176,
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=900&q=84',
  },
  {
    id: 8,
    category: '日常分享',
    tone: 'daily',
    title: '可愛虎斑貓找家！親人又撒嬌的小男生',
    likes: 212,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=84',
  },
])

const articleSeries = ['收藏篇', '進階篇']
const articles = Object.freeze([
  ...baseArticles,
  ...Array.from({ length: 16 }, (_, index) => {
    const source = baseArticles[index % baseArticles.length]
    const series = articleSeries[Math.floor(index / baseArticles.length)]
    return {
      ...source,
      id: `more-${index + 1}`,
      title: `${source.title}｜${series}`,
      likes: source.likes + (index + 1) * 7,
    }
  }),
])
const profileArticles = computed(() =>
  props.canEdit ? articles.slice(1) : articles,
)

const { hasMore, isLoading, loadTrigger, visibleItemCount } = useWheelBatchLoading({
  totalItems: profileArticles.value.length,
  initialItems: props.canEdit ? 7 : 8,
  batchSize: 8,
})
const visibleArticles = computed(() =>
  profileArticles.value.slice(0, visibleItemCount.value),
)
</script>

<template>
  <section
    id="profile-articles-panel"
    class="profile-articles-panel"
    role="tabpanel"
    aria-labelledby="profile-tab-articles"
  >
    <h2 class="sr-only">我的文章</h2>
    <TransitionGroup name="profile-article-lazy" tag="div" class="profile-article-grid">
      <RouterLink
        v-if="canEdit"
        key="article-editor"
        class="profile-article-card profile-article-edit-card"
        :to="`/profile/${userId}/articles/edit`"
      >
        <svg aria-hidden="true"><use href="#icon-edit" /></svg>
        <strong>管理文章</strong>
      </RouterLink>
      <article v-for="article in visibleArticles" :key="article.id" class="profile-article-card">
        <div class="profile-article-image">
          <img :src="article.image" :alt="article.title" loading="lazy" />
          <span :class="`is-${article.tone}`">{{ article.category }}</span>
        </div>
        <div class="profile-article-copy">
          <h3>{{ article.title }}</h3>
          <span class="profile-article-likes" :aria-label="`${article.likes} 個喜歡`">
            <svg aria-hidden="true"><use href="#icon-like" /></svg>{{ article.likes }}
          </span>
        </div>
      </article>
    </TransitionGroup>
    <div v-if="hasMore" ref="loadTrigger" class="profile-article-load-trigger">
      <ProfileBatchLoader :active="isLoading" />
    </div>
  </section>
</template>

<style src="../../styles/components/ProfileArticlesTab.css"></style>

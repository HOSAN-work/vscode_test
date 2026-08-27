<script setup>
import { computed } from 'vue'
import { useWheelBatchLoading } from '../../composables/useWheelBatchLoading'
import ProfileBatchLoader from '../profile/ProfileBatchLoader.vue'

const props = defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
})

const totalItems = computed(() => props.articles.length)
const { hasMore, isLoading, loadTrigger, visibleItemCount } = useWheelBatchLoading({
  totalItems,
  initialItems: 8,
  batchSize: 8,
})
const visibleArticles = computed(() => props.articles.slice(0, visibleItemCount.value))
</script>

<template>
  <section class="articles-results" aria-label="文章列表">
    <TransitionGroup
      v-if="visibleArticles.length"
      name="articles-card-lazy"
      tag="div"
      class="articles-card-grid"
    >
      <article v-for="article in visibleArticles" :key="article.id" class="articles-card">
        <div class="articles-card__image">
          <img :src="article.image" :alt="article.title" loading="lazy" />
          <span :class="`is-${article.tone}`">{{ article.category }}</span>
        </div>
        <div class="articles-card__copy">
          <h2>{{ article.title }}</h2>
          <span class="articles-card__likes" :aria-label="`${article.likes} 個讚`">
            <svg aria-hidden="true"><use href="#icon-like" /></svg>
            {{ article.likes }}
          </span>
        </div>
      </article>
    </TransitionGroup>

    <div v-else class="articles-empty" role="status">
      <svg aria-hidden="true"><use href="#icon-search" /></svg>
      <h2>找不到符合條件的文章</h2>
      <p>請換一個關鍵字，或選擇其他文章分類。</p>
    </div>

    <div v-if="hasMore" ref="loadTrigger" class="articles-load-trigger">
      <ProfileBatchLoader :active="isLoading" />
    </div>
  </section>
</template>

<style src="../../styles/components/ArticlesGrid.css"></style>

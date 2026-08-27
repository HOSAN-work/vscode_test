<script setup>
import { computed, ref } from 'vue'
import ArticlesGrid from '../components/articles/ArticlesGrid.vue'
import ArticlesSidebar from '../components/articles/ArticlesSidebar.vue'
import { articleCatalog, articleCategories } from '../data/articles'

const keyword = ref('')
const activeCategory = ref('all')

const normalizedKeyword = computed(() => keyword.value.trim().toLocaleLowerCase('zh-TW'))

const categoryCounts = computed(() =>
  articleCatalog.reduce((counts, article) => {
    counts[article.categoryId] = (counts[article.categoryId] ?? 0) + 1
    return counts
  }, {}),
)

const filteredArticles = computed(() =>
  articleCatalog.filter((article) => {
    const matchesCategory =
      activeCategory.value === 'all' || article.categoryId === activeCategory.value
    const matchesKeyword =
      !normalizedKeyword.value ||
      `${article.title} ${article.category}`
        .toLocaleLowerCase('zh-TW')
        .includes(normalizedKeyword.value)

    return matchesCategory && matchesKeyword
  }),
)

const gridKey = computed(() => `${activeCategory.value}:${normalizedKeyword.value}`)
</script>

<template>
  <section class="articles-view" aria-label="文章頁面">
    <div class="articles-layout">
      <ArticlesSidebar
        v-model:keyword="keyword"
        v-model:active-category="activeCategory"
        :categories="articleCategories"
        :category-counts="categoryCounts"
        :total-count="articleCatalog.length"
        :result-count="filteredArticles.length"
      />

      <div class="articles-main-pane">
        <div class="articles-fixed-toolbar" aria-label="文章操作">
          <RouterLink class="articles-create-button" :to="{ name: 'articles-edit' }">
            <svg aria-hidden="true"><use href="#icon-article" /></svg>
            <span>發文</span>
          </RouterLink>
        </div>
        <ArticlesGrid :key="gridKey" :articles="filteredArticles" />
      </div>
    </div>
  </section>
</template>

<style src="../styles/views/ArticlesView.css"></style>

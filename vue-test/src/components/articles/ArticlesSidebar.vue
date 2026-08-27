<script setup>
import { computed } from 'vue'

const props = defineProps({
  keyword: {
    type: String,
    default: '',
  },
  activeCategory: {
    type: String,
    default: 'all',
  },
  categories: {
    type: Array,
    default: () => [],
  },
  categoryCounts: {
    type: Object,
    default: () => ({}),
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  resultCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:keyword', 'update:activeCategory'])

const searchKeyword = computed({
  get: () => props.keyword,
  set: (value) => emit('update:keyword', value),
})

function selectCategory(categoryId) {
  emit('update:activeCategory', categoryId)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <aside class="articles-sidebar" aria-label="文章搜尋與分類">
    <label class="articles-search">
      <span class="articles-search__label">關鍵字搜尋</span>
      <span class="articles-search__field">
        <svg aria-hidden="true"><use href="#icon-search" /></svg>
        <input
          v-model="searchKeyword"
          type="search"
          placeholder="搜尋文章標題或分類"
          autocomplete="off"
        />
        <button
          v-if="keyword"
          type="button"
          aria-label="清除文章搜尋內容"
          @click="searchKeyword = ''"
        >
          ×
        </button>
      </span>
    </label>

    <p v-if="keyword.trim()" class="articles-search-result" aria-live="polite">
      找到 <strong>{{ resultCount }}</strong> 篇文章
    </p>

    <nav class="articles-category-nav" aria-label="文章分類">
      <h2>文章分類</h2>
      <button
        type="button"
        :class="{ 'is-active': activeCategory === 'all' }"
        :aria-current="activeCategory === 'all' ? 'page' : undefined"
        @click="selectCategory('all')"
      >
        <svg aria-hidden="true"><use href="#icon-paw" /></svg>
        <span>全部文章</span>
        <small>{{ totalCount }}</small>
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :class="{ 'is-active': activeCategory === category.id }"
        :aria-current="activeCategory === category.id ? 'page' : undefined"
        @click="selectCategory(category.id)"
      >
        <svg aria-hidden="true"><use :href="category.icon" /></svg>
        <span>{{ category.label }}</span>
        <small>{{ categoryCounts[category.id] ?? 0 }}</small>
      </button>
    </nav>
  </aside>
</template>

<style src="../../styles/components/ArticlesSidebar.css"></style>

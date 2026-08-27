<template>
  <section class="articles-manage-view" aria-label="文章管理頁">
    <RouterLink class="articles-manage-back" :to="{ name: 'articles' }">
      <svg aria-hidden="true"><use href="#icon-arrow-left" /></svg>
      返回文章頁
    </RouterLink>
  </section>
</template>

<style src="../styles/views/ArticlesEditView.css"></style>

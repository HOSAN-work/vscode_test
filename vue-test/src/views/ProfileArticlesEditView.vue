<template>
  <section class="articles-edit-view" aria-label="文章編輯頁">
    <RouterLink class="articles-edit-back" :to="`/profile/${$route.params.id}`">
      <svg aria-hidden="true"><use href="#icon-arrow-left" /></svg>
      返回個人主頁
    </RouterLink>
  </section>
</template>

<style src="../styles/views/ProfileArticlesEditView.css"></style>

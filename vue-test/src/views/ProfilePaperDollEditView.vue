<template>
  <section class="paper-doll-edit-view" aria-label="紙娃娃編輯頁">
    <RouterLink class="paper-doll-edit-back" :to="`/profile/${$route.params.id}`">
      <svg aria-hidden="true"><use href="#icon-arrow-left" /></svg>
      返回個人主頁
    </RouterLink>
  </section>
</template>

<style src="../styles/views/ProfilePaperDollEditView.css"></style>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'close', 'open-check-in'])

const notifications = ref([
  {
    id: 1,
    icon: '💬',
    title: '小白麻回覆了你的留言',
    detail: '「第一次帶毛孩旅行」',
    time: '3 分鐘前',
    to: '/articles',
    unread: true,
  },
  {
    id: 2,
    icon: '❤',
    title: '多多爸收藏了你的貼文',
    detail: '快來看看大家的最新互動',
    time: '1 小時前',
    to: '/gallery',
    unread: true,
  },
  {
    id: 3,
    icon: '🪙',
    title: '今天還沒完成每日簽到',
    detail: '完成簽到即可領取 10 枚噗幣',
    time: '今天 09:00',
    action: 'check-in',
    unread: true,
  },
])

const notificationCount = computed(
  () => notifications.value.filter((notification) => notification.unread).length,
)

function openNotification(notification) {
  notification.unread = false
  emit('close')

  if (notification.action === 'check-in') {
    emit('open-check-in')
  }
}

function markAllRead() {
  notifications.value.forEach((notification) => {
    notification.unread = false
  })
}
</script>

<template>
  <div class="notifications">
    <button
      class="icon-button notification-button"
      type="button"
      :aria-label="
        notificationCount
          ? `查看通知，目前有 ${notificationCount} 則未讀`
          : '查看通知，沒有未讀通知'
      "
      :aria-expanded="open"
      aria-controls="notification-menu"
      @click="$emit('toggle')"
    >
      <svg><use href="#icon-bell" /></svg>
      <span v-if="notificationCount" class="notification-count">{{ notificationCount }}</span>
    </button>

    <div
      id="notification-menu"
      class="notification-menu"
      :class="{ 'is-open': open }"
      :aria-hidden="!open"
    >
      <div class="notification-heading">
        <strong>通知</strong>
        <button type="button" class="mark-all-read" @click="markAllRead">全部標為已讀</button>
      </div>
      <div class="notification-list">
        <component
          :is="notification.to ? RouterLink : 'button'"
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'is-unread': notification.unread }"
          :to="notification.to"
          :type="notification.to ? undefined : 'button'"
          @click="openNotification(notification)"
        >
          <span class="notification-icon">{{ notification.icon }}</span>
          <span class="notification-copy">
            <b>{{ notification.title }}</b>
            <small>{{ notification.detail }}</small>
            <time>{{ notification.time }}</time>
          </span>
          <i v-if="notification.unread" aria-label="未讀通知"></i>
        </component>
      </div>
      <RouterLink class="notification-footer-link" to="/articles" @click="$emit('close')">
        查看所有通知
      </RouterLink>
    </div>
  </div>
</template>

<style src="../../styles/components/NotificationMenu.css"></style>

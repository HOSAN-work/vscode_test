<script setup>
import hsiehAvatar from '../assets/許賀珊.PNG'
import lengAvatar from '../assets/冷儀萱.PNG'
import yangAvatar from '../assets/楊雅婷.PNG'
import leeAvatar from '../assets/李采蓉.PNG'

const teamMembers = [
  {
    name: '許賀珊',
    role: '組員',
    roleTone: 'member',
    avatar: hsiehAvatar,
    responsibilities: [
      '資料庫建置',
      '權限控管',
      '帳號相關功能與頁面',
      '第三方社群登入整合',
    ],
  },
  {
    name: '冷儀萱',
    role: '組員',
    roleTone: 'member',
    avatar: lengAvatar,
    responsibilities: [
      '頁面美術設計',
      '紙娃娃/Logo素材繪製',
      '雲端圖床串接',
      '文章相關功能與頁面',
      '常見問答（FAQ）頁面',
    ],
  },
  {
    name: '楊雅婷',
    role: '組長',
    roleTone: 'leader',
    avatar: yangAvatar,
    responsibilities: [
      '專案資料彙整',
      '商品資料上架',
      '畫廊相關頁面',
      '購物相關功能與頁面',
    ],
  },
  {
    name: '李采蓉',
    role: '技術長',
    roleTone: 'technical',
    avatar: leeAvatar,
    responsibilities: [
      '資料庫架構設計',
      '前端畫面/後端架構建置',
      'GitHub 分支管理',
      '通知/聊天室相關功能',
      '點數系統相關功能',
    ],
  },
]
</script>

<template>
  <section class="team-view" aria-label="開發團隊成員">
    <div class="team-grid">
      <article
        v-for="member in teamMembers"
        :key="member.name"
        class="team-member-card"
      >
        <div class="team-member-card__portrait">
          <img
            :src="member.avatar"
            :alt="`${member.name}的角色頭像`"
            width="180"
            height="180"
          />
        </div>

        <div class="team-member-card__identity">
          <h2>{{ member.name }}</h2>
          <span
            class="team-member-card__role"
            :class="`team-member-card__role--${member.roleTone}`"
          >
            {{ member.role }}
          </span>
        </div>

        <div class="team-member-card__divider" aria-hidden="true">
          <span>🐾</span>
        </div>

        <ol class="team-member-card__tasks">
          <li v-for="task in member.responsibilities" :key="task">
            <span>{{ task }}</span>
          </li>
        </ol>
      </article>
    </div>
  </section>
</template>

<style src="../styles/views/TeamView.css"></style>

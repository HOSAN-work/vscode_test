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

const baseDollLooks = Object.freeze([
  {
    id: 1,
    name: '暖陽散步套裝',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=84',
    status: '使用中',
    parts: ['焦糖貝雷帽', '奶茶圍巾', '腳印名牌'],
  },
  {
    id: 2,
    name: '森林探險家',
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=900&q=84',
    status: '已收藏',
    parts: ['探險小帽', '橄欖背心', '迷你水壺'],
  },
  {
    id: 3,
    name: '莓果下午茶',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=900&q=84',
    status: '已收藏',
    parts: ['莓果領結', '格紋披肩', '甜點吊飾'],
  },
  {
    id: 4,
    name: '星夜魔法師',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=84',
    status: '已收藏',
    parts: ['星星帽', '月光斗篷', '鈴鐺項圈'],
  },
  {
    id: 5,
    name: '奶油野餐日',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=84',
    status: '已收藏',
    parts: ['草帽', '檸檬領巾', '野餐小包'],
  },
  {
    id: 6,
    name: '慵懶居家服',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=84',
    status: '已收藏',
    parts: ['睡帽', '雲朵睡衣', '小魚抱枕'],
  },
])

const dollSeries = ['午後版', '假日版']
const dollLooks = Object.freeze([
  ...baseDollLooks,
  ...Array.from({ length: 12 }, (_, index) => {
    const source = baseDollLooks[index % baseDollLooks.length]
    const series = dollSeries[Math.floor(index / baseDollLooks.length)]
    return {
      ...source,
      id: `more-${index + 1}`,
      name: `${source.name}・${series}`,
      status: '已收藏',
    }
  }),
])
const profileDollLooks = computed(() =>
  props.canEdit ? dollLooks.slice(1) : dollLooks,
)

const { hasMore, isLoading, loadTrigger, visibleItemCount } = useWheelBatchLoading({
  totalItems: profileDollLooks.value.length,
  initialItems: props.canEdit ? 5 : 6,
  batchSize: 6,
})
const visibleDollLooks = computed(() =>
  profileDollLooks.value.slice(0, visibleItemCount.value),
)
</script>

<template>
  <section
    id="profile-paper-doll-panel"
    class="profile-paper-doll-panel"
    role="tabpanel"
    aria-labelledby="profile-tab-paper-doll"
  >
    <h2 class="sr-only">紙娃娃收藏</h2>
    <TransitionGroup name="profile-doll-lazy" tag="div" class="profile-doll-grid">
      <RouterLink
        v-if="canEdit"
        key="paper-doll-editor"
        class="profile-doll-card profile-doll-edit-card"
        :to="`/profile/${userId}/paper-doll/edit`"
      >
        <svg aria-hidden="true"><use href="#icon-edit" /></svg>
        <strong>管理紙娃娃</strong>
      </RouterLink>
      <article v-for="look in visibleDollLooks" :key="look.id" class="profile-doll-card">
        <div class="profile-doll-image">
          <img :src="look.image" :alt="`${look.name}紙娃娃造型`" loading="lazy" />
        </div>
      </article>
    </TransitionGroup>
    <div v-if="hasMore" ref="loadTrigger" class="profile-doll-load-trigger">
      <ProfileBatchLoader :active="isLoading" />
    </div>
  </section>
</template>

<style src="../../styles/components/ProfilePaperDollTab.css"></style>

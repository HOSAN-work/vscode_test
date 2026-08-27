import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProfile } from '../composables/useProfile'
import HomeView from '../views/HomeView.vue'

const { isLoggedIn } = useAuth()
const { currentUserId } = useProfile()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'is-active',
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      alias: '/home',
      meta: { enterTransition: 'page-fade' },
    },
    {
      path: '/articles/edit',
      name: 'articles-edit',
      component: () => import('../views/ArticlesEditView.vue'),
      meta: { requiresAuth: true, enterTransition: 'page-fade' },
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticlesView.vue'),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('../views/DiscoverView.vue'),
      meta: { enterTransition: 'page-fade' },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: { enterTransition: 'page-fade' },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('../views/TeamView.vue'),
      meta: { enterTransition: 'team-page' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true, authFlowIndex: 1, enterTransition: 'page-rise' },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { guestOnly: true, authFlowIndex: 0 },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { authFlowIndex: 3, enterTransition: 'page-rise' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true, authFlowIndex: 2 },
    },
    {
      path: '/profile',
      redirect: () => `/profile/${currentUserId.value}`,
    },
    {
      path: '/profile/:id(\\d+)/paper-doll/edit',
      name: 'profile-paper-doll-edit',
      component: () => import('../views/ProfilePaperDollEditView.vue'),
      meta: { requiresAuth: true, ownerOnly: true, profileFlowIndex: 1 },
    },
    {
      path: '/profile/:id(\\d+)/articles/edit',
      name: 'profile-articles-edit',
      component: () => import('../views/ProfileArticlesEditView.vue'),
      meta: { requiresAuth: true, ownerOnly: true, profileFlowIndex: 1 },
    },
    {
      path: '/profile/:id(\\d+)/followers/edit',
      name: 'profile-followers-edit',
      component: () => import('../views/ProfileFollowersEditView.vue'),
      meta: { requiresAuth: true, ownerOnly: true, profileFlowIndex: 1 },
    },
    {
      path: '/profile/:id(\\d+)',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true, profileFlowIndex: 0, enterTransition: 'page-fade' },
    },
    {
      path: '/points-shop',
      name: 'points-shop',
      component: () => import('../views/PointsShopView.vue'),
      meta: { requiresAuth: true, enterTransition: 'page-fade' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from) => {
  const toAuthIndex = to.meta.authFlowIndex
  const fromAuthIndex = from.meta.authFlowIndex
  const toProfileIndex = to.meta.profileFlowIndex
  const fromProfileIndex = from.meta.profileFlowIndex

  if (typeof toAuthIndex === 'number' && typeof fromAuthIndex === 'number') {
    to.meta.pageTransition =
      toAuthIndex >= fromAuthIndex ? 'auth-slide-left' : 'auth-slide-right'
  } else if (typeof toProfileIndex === 'number' && typeof fromProfileIndex === 'number') {
    to.meta.pageTransition =
      toProfileIndex >= fromProfileIndex ? 'profile-route-left' : 'profile-route-right'
  } else {
    to.meta.pageTransition = to.meta.enterTransition ?? 'route-static'
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.ownerOnly && Number(to.params.id) !== currentUserId.value) {
    return {
      name: 'profile',
      params: { id: to.params.id },
    }
  }

  if (to.meta.guestOnly && isLoggedIn.value) {
    return { name: 'home' }
  }

  return true
})

export default router

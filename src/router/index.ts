import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BeforeTalkingView from '@/views/BeforeTalkingView.vue'
import WaitPickUpView from '@/views/WaitPickUpView.vue'
import TalkingView from '@/views/TalkingView.vue'
import TestTalkView from '@/views/TestTalkView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/before-talk',
      name: 'beforeTalk',
      component: BeforeTalkingView
    },
    {
      path: '/wait-pick-up',
      name: 'waitpickup',
      component: WaitPickUpView
    },
    {
      path: '/talking',
      name: 'talking',
      component: TalkingView
    },
    {
      path: '/test-talk',
      name: 'test-talk',
      component: TestTalkView
    }
  ]
})

export default router

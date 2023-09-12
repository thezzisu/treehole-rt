import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/project',
      component: () => import('@/views/Project.vue')
    },
    {
      path: '/client',
      component: () => import('@/views/Client.vue')
    }
  ]
})

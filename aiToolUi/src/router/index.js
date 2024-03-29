import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/about2',
      name: 'about2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView2.vue')
    },
    {
      path: '/ImagesWall',
      name: 'ImagesWall',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ImagesWall.vue')
    },
    {
      path: '/ImageMj',
      name: 'ImageMj',
      component: () => import('../views/ImageMj.vue')
    },
    {
      path: '/ImageQe',
      name: 'ImageQe',
      component: () => import('../views/ImageQe.vue')
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { registerGuards } from '@router/guards'

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      requiresGuest: true,
    },
    component: () => import('@views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'main',
    meta: {
      requiresAuth: true,
    },
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'operator',
        name: 'operator',
        meta: {
          roles: ['operator'],
        },
        component: () => import('@/views/OperatorView.vue'),
      },
      {
        path: 'supervisor',
        name: 'supervisor',
        meta: {
          roles: ['supervisor'],
        },
        component: () => import('@/views/SupervisorView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

registerGuards(router)

export default router

import type { Router } from 'vue-router'
import { useAuthStore } from '@stores/auth'

export function registerGuards(router: Router) {
  router.beforeEach(to => {
    const authStore = useAuthStore()
    const { role } = authStore.state
    const { roles } = to.meta as { roles: string[] }

    if (to.meta.requiresAuth && !authStore.state.token) {
      return { name: 'login' }
    }

    if (to.meta.requiresGuest && authStore.state.token) {
      return { name: 'dashboard' }
    }

    if (to.meta.requiresAuth && to.name !== 'dashboard' && !roles.includes(role!)) {
      return { name: 'dashboard' }
    }
  })
}

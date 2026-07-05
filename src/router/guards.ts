import type { Router } from 'vue-router'
import { useAuthStore } from '@stores/auth'

export function registerGuards(router: Router) {
  router.beforeEach(to => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.state.token) {
      return { name: 'login' }
    }

    if (to.meta.requiresGuest && authStore.state.token) {
      return { name: 'dashboard' }
    }

    const roles = to.meta.roles

    if (to.meta.requiresAuth && roles && !roles.includes(authStore.state.role!)) {
      return { name: 'dashboard' }
    }
  })
}

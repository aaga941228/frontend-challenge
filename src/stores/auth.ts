import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type AuthState } from '@models/auth'
import { login as loginService } from '@services/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const state = reactive<AuthState>({
      email: null,
      token: null,
      role: null,
    })

    const login = async (email: string, password: string) => {
      const data = await loginService(email, password)

      state.email = data.email
      state.token = data.token
      state.role = data.role
    }

    const logout = () => {
      state.email = null
      state.token = null
      state.role = null
    }

    return {
      state,
      login,
      logout,
    }
  },
  { persist: true }
)

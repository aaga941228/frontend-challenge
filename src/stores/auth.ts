import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type AuthState } from '@models/auth'
import { login as loginService } from '@services/auth'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthState>({
    email: null,
    token: null,
    role: null,
  })

  const login = async (email: string, password: string) => {
    const { token, role } = await loginService(email, password)

    state.email = email
    state.token = token
    state.role = role
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
})

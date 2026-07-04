import http from '@api/http'
import type { LoginResponse } from '@/types/loginResponse'

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await http.post('/login', {
    email,
    password,
  })

  return data
}

import type { Role } from '@models/auth'

export interface LoginResponse {
  token: string
  email: string
  role: Role
}

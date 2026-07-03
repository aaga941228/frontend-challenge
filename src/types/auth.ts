export type Role = 'supervisor' | 'operator'
export interface AuthState {
  email: string | null
  token: string | null
  role: Role | null
}

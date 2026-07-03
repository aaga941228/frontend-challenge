export interface AuthState {
  email: string | null
  token: string | null
  role: 'supervisor' | 'operador' | null
}

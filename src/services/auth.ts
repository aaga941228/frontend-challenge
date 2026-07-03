import { ALLOWED_USERS, DEFAULT_PASSWORD } from '@/constants/auth'
import type { Role } from '@/types/auth'
import type { LoginResponse } from '@/types/loginResponse'
import { generateToken } from '@utils/jwt'

const login = async (email: string, password: string): Promise<LoginResponse> => {
  if (!ALLOWED_USERS.includes(email) || password !== DEFAULT_PASSWORD) {
    throw new Error('Credenciales invalidas')
  }

  const role = email.split('@')[0] as Role
  const id = role === 'supervisor' ? 1 : 2

  const token = await generateToken({
    id,
    role,
    email,
  })

  return { email, token, role }
}

export { login }

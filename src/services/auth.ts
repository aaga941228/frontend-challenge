import type { Role } from '@/types/auth'
import type { LoginResponse } from '@/types/loginResponse'
import { generateToken } from '@utils/jwt'

const login = async (email: string, password: string): Promise<LoginResponse> => {
  const allowedEmails = ['supervisor@test.com', 'operator@test.com']
  const allowedPassword = 'password'

  if (!allowedEmails.includes(email) || password !== allowedPassword) {
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

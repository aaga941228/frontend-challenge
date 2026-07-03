import { generateToken } from '@utils/jwt'

const login = async (
  email: string,
  password: string
): Promise<{ token: string; role: 'supervisor' | 'operador' }> => {
  const allowedEmails = ['supervisor@test.com', 'operador@test.com']
  const allowedPassword = 'password'

  if (!allowedEmails.includes(email) || password !== allowedPassword) {
    throw new Error('Credenciales invalidas')
  }

  const role = email.split('@')[0] as 'supervisor' | 'operador'
  const id = role === 'supervisor' ? 1 : 2

  const token = await generateToken({
    id,
    role,
    email,
  })

  return { token, role }
}

export { login }

import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode('eglobal-secret')

export async function generateToken(payload: Record<string, unknown>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET)
}

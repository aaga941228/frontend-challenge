import CryptoJS from 'crypto-js'

const SECRET = 'eglobal-secret' // mover a .env

export const encrypt = (value: string) => {
  return CryptoJS.AES.encrypt(value, SECRET).toString()
}

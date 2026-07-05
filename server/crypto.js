const CryptoJS = require('crypto-js')

const SECRET = 'eglobal-secret'

function decrypt(value) {
  return CryptoJS.AES.decrypt(value, SECRET).toString(
    CryptoJS.enc.Utf8
  )
}

function encrypt(value) {
  return CryptoJS.AES.encrypt(value, SECRET).toString()
}

module.exports = {
  decrypt,
  encrypt,
}
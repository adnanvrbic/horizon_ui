import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const TOKEN_KEY = 'auth_token'
const SECRET_KEY = 'my_super_secret'

export function setToken(token: any, ttlMinutes = 5) {
  const payload = {
    token,
    expiresAt: Date.now() + 60 * 1000
  }
  const stringified = JSON.stringify(payload)
  const encrypted = CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString()
  Cookies.set(TOKEN_KEY, encrypted, {
    expires: ttlMinutes / (60 * 24),   
    path: '/',
  })
}

export function getToken() {
  const encrypted = Cookies.get(TOKEN_KEY)
  if (!encrypted) return null

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

    if (Date.now() > decrypted.expiresAt) {
      removeToken()
      return null
    }

    return decrypted.token
  } catch {
    removeToken()
    return null
  }
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

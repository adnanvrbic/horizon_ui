import { ref, watch, type Ref } from 'vue'
import Cookies from 'js-cookie'
import { destr } from 'destr'

export interface CookieOptions<T = any> extends Cookies.CookieAttributes {
  decode?(value: string): T
  encode?(value: T): string
  default?: () => T | Ref<T>
  watch?: boolean | 'shallow'
}

export type CookieRef<T> = Ref<T>

const CookieDefaults: CookieOptions<any> = {
  path: '/',
  watch: true,
  decode: val => destr(decodeURIComponent(val)),
  encode: val => encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val)),
}

export const useCookie = <T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T>
): CookieRef<T> => {
  const opts = { ...CookieDefaults, ..._opts }

  const rawValue = Cookies.get(name)
  const cookie = ref<T | undefined>(
    rawValue !== undefined ? opts.decode?.(rawValue) : resolveDefault<T>(opts.default)
  )
  if (opts.watch) {
    watch(cookie, (val) => {
      if (val === null || val === undefined) {
        Cookies.remove(name, { path: opts.path })
      } else {
        Cookies.set(name, opts.encode?.(val) ?? '', opts)
      }
    }, { deep: opts.watch !== 'shallow' })
  }

  return cookie as CookieRef<T>
}

function resolveDefault<T>(def?: () => T | Ref<T>): T | undefined {
  const value = typeof def === 'function' ? def() : def
  return isRef(value) ? value.value : value
}

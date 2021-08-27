import Cookies from './cookies.utils'

export const persist = (key: string, value: string, duration?: number) => {
  return new Promise<void>((resolve) => {
    Cookies.set(key, value, duration)
    window.localStorage.setItem(key, value)
    window.localStorage.setItem(
      `${key}:duration`,
      duration?.toString() ?? 'unknown'
    )
    resolve()
  })
}

export const destroy = (key: string) => {
  return new Promise<void>((resolve) => {
    Cookies.remove(key)
    window.sessionStorage.removeItem(key)
    window.localStorage.removeItem(key)
    resolve()
  })
}

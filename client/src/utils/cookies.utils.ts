const set = (name: string, value: any, duration?: number) => {
  let expires = ''
  if (duration) {
    const date = new Date()
    date.setTime(date.getTime() + duration)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`
}

const get = (name: string) => {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const remove = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"`
}

export default {
  remove,
  get,
  set,
}

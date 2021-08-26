export const port = 2000
export const apiUrl =
  (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3000'
export const apiVersion = (import.meta.env.VITE_API_VERSION as string) ?? 'v1'
export const sentry = import.meta.env.VITE_SENTRY as string

import axios, { AxiosError, AxiosInstance } from 'axios'
import { apiUrl, apiVersion } from '../env'
import { useAuth } from '../utils/auth.utils'
import { useToast } from 'vue-toastification'

const toast = useToast()
const _log = (...args: any[]) =>
  console.log('%c API: ', 'color: #C1592A', ...args)

export class SpotifyLikedAPI {
  api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: `${apiUrl}/${apiVersion}`,
      headers: {
        'api-version': apiVersion || '',
      },
    })
    this.configureInterceptors(this.api)
  }

  configureInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.response.use(
      (response) => {
        const { status } = response
        _log(`SUCCESS:${status} ${response.config.url}`)
        return response
      },
      (error: AxiosError) => {
        const { response } = error
        if (response) {
          try {
            const { status, data } = response
            const { message } = data

            switch (status) {
              case 403:
              case 401:
                if (message === 'Unauthorized (A1)') {
                  // User not logged in
                  _log('User not logged in')
                  // TODO: logout user if a token is set
                }

                break
              default:
                toast.error(`${message ?? 'No message was provided'}`)
                break
            }
          } catch (e) {
            toast.error(`INTERCEPTOR:ERROR something went wrong`, e)
          }
        }

        _log(`ERROR:${response?.status} ${response?.config.url}`)
        return Promise.reject(error)
      }
    )
    return axiosInstance
  }

  execute(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    resource: string,
    data?: any,
    extraHeaders = {}
  ) {
    const { getToken } = useAuth()
    const token = getToken()
    this.api.defaults.headers['authorization'] = 'Bearer ' + token

    this.api.defaults.headers[method] =
      extraHeaders ?? this.api.defaults.headers[method]

    return this.api({
      method,
      url: resource,
      data: data ?? null,
    })
  }
}

export default new SpotifyLikedAPI()

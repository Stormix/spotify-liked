import axios, { AxiosInstance } from 'axios'
import { apiUrl, apiVersion } from '../env'
import { useAuth } from '../utils/auth.utils'

export class SpotifyLikedAPI {
  api: AxiosInstance
  constructor() {
    this.api = axios.create({
      baseURL: `${apiUrl}/${apiVersion}`,
      headers: {
        'api-version': apiVersion || '',
      },
    })
  }

  execute(
    method: 'GET' | 'POST',
    resource: string,
    data: any,
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
      data,
    })
  }
}

export default new SpotifyLikedAPI()
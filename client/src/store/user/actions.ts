import { cookieName } from '../../config/auth.config'
import api from '../../providers/api'
import { Context } from '../../typings/Context'
import { destroy } from '../../utils/persist.utils'
import { UserState } from './'

const fetch = async (context: Context<UserState>): Promise<void> => {
  try {
    context.commit(`setLoading`, true)
    const response = await api.execute('GET', 'users/me', {})
    const user = response.data
    context.commit('setUser', user)
    return
  } catch (e) {
    return Promise.reject(e)
  } finally {
    context.commit(`setLoading`, false)
  }
}

const fetchTracks = async (context: Context<UserState>): Promise<void> => {
  try {
    context.commit(`setLoading`, true)
    const response = await api.execute('GET', 'users/tracks', {})
    const tracks = response.data
    context.commit('setTracks', tracks)
    return
  } catch (e) {
    return Promise.reject(e)
  } finally {
    context.commit(`setLoading`, false)
  }
}

const logout = async (context: Context<UserState>): Promise<void> => {
  try {
    context.commit(`setLoading`, true)
    context.commit('setUser', null)
    await destroy(cookieName)
    return
  } catch (e) {
    return Promise.reject(e)
  } finally {
    context.commit(`setLoading`, false)
  }
}

const deletePlaylist = async (context: Context<UserState>): Promise<void> => {
  try {
    context.commit(`setLoading`, true)
    await api.execute('DELETE', 'users/playlist')
    await fetch(context)
    return
  } catch (e) {
    return Promise.reject(e)
  } finally {
    context.commit(`setLoading`, false)
  }
}

const syncPlaylist = async (context: Context<UserState>): Promise<void> => {
  try {
    context.commit(`setLoading`, true)
    await api.execute('POST', 'users/playlist/sync')
    await fetch(context)
    return
  } catch (e) {
    return Promise.reject(e)
  } finally {
    context.commit(`setLoading`, false)
  }
}

export default {
  fetch,
  logout,
  fetchTracks,
  deletePlaylist,
  syncPlaylist,
}

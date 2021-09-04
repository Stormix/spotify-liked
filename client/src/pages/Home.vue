<template>
  <div v-if="!user" class="flex h-full">
    <div class="py-6 my-auto hero bg-base-200">
      <div class="text-center hero-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
          <p class="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <div data-tip="Login with your spotify account" class="tooltip">
            <button
              class="btn btn-primary btn-xs md:btn-sm lg:btn-md xl:btn-lg"
              @click="login"
            >
              Login with spotify
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="py-4">
    <div v-if="tracks.length > 0" class="w-full shadow stats bg-neutral">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Liked Songs</div>
        <div class="stat-value text-primary">{{ tracks.length || '_' }}</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Duration</div>
        <div class="stat-value text-info">
          {{
            totalDuration
              ? customFormatDuration({ start: 0, end: totalDuration })
              : '_'
          }}
        </div>
      </div>
    </div>
    <loading v-else />

    <div v-if="playlist" class="my-4">
      <h3 class="mb-4 text-2xl font-bold">Playlist:</h3>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Playlist</th>
              <th>Status</th>
              <th>Tracks</th>
              <th>Last updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="items-center">
              <td>
                <a
                  :href="`https://open.spotify.com/playlist/${playlist.id}`"
                  target="_blank"
                  class="link-primary"
                >
                  {{ playlist.name }}
                </a>
              </td>
              <td>
                <div class="badge badge-secondary badge-outline">
                  {{ playlist?.status ?? 'unknown' }}
                </div>
              </td>
              <td>
                {{ playlist?.length ?? 0 }}
              </td>
              <td>
                <span class="italic opacity-60">{{ lastUpdated }}</span>
              </td>
              <td class="flex">
                <button
                  class="mr-2 normal-case btn btn-xs btn-outline btn-primary"
                >
                  Sync now
                </button>

                <button
                  class="normal-case btn btn-xs btn-outline btn-primary"
                  @click="confirmDelete"
                >
                  Delete
                </button>
                <confirm-modal
                  id="confirm-delete"
                  :message="`This action will remove your playlist and all associated tracks. It
              cannot be undone.`"
                  :modal-status="showConfirmDelete"
                  :loading="deleteLoading"
                  @confirm="deletePlaylist"
                  @close="close"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="my-4">
      <h3 class="mb-4 text-2xl font-bold">Liked songs:</h3>
      <song-list v-if="tracks.length > 0" />
      <loading v-else />

      <div class="flex">
        <div class="flex-1"></div>
        <label
          for="generate-playlist-model"
          class="btn btn-accent modal-button"
        >
          {{ playlist ? 'Update playlist' : 'Generate playlist' }}
        </label>
        <input
          id="generate-playlist-model"
          type="checkbox"
          class="modal-toggle"
        />
        <div class="modal">
          <div class="modal-box">
            <h3 class="mb-2 text-2xl font-bold">
              {{ playlist ? 'Update playlist' : 'Generate playlist' }}
            </h3>
            <p>Enim dolorem dolorum omnis atque necessitatibus.</p>

            <div v-if="playlist?.id" class="alert alert-success">
              <div class="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="w-6 h-6 mx-2 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                <label>
                  You can checkout your playlist <a href="">here</a> .
                </label>
              </div>
            </div>

            <form>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Playlist Name</span>
                </label>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Add a name"
                  class="input"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Description</span>
                </label>
                <textarea
                  v-model="description"
                  placeholder="Add a description"
                  class="input"
                />
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Make playlist public?</span>
                  <input
                    v-model="isPublic"
                    type="checkbox"
                    checked="checked"
                    class="toggle"
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Automatically sync playlist?</span>
                  <input
                    type="checkbox"
                    checked="checked"
                    class="toggle"
                    b-model="sync"
                  />
                </label>
              </div>
            </form>

            <div class="modal-action">
              <button
                for="generate-playlist-model"
                class="btn btn-primary"
                :class="{
                  loading: createLoading,
                }"
                :disabled="createLoading"
                @click="createPlaylist"
              >
                Create
              </button>
              <label for="generate-playlist-model" class="btn">Cancel</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, State } from 'vue'
  import API from '@/providers/api'
  import { useToast } from 'vue-toastification'
  import { useAuth } from '../utils/auth.utils'
  import { useStore } from 'vuex'
  import { customFormatDuration } from '../utils/time.utils'
  import SongList from '../components/sections/SongList.vue'
  import Loading from '../components/blocks/loading.vue'
  import { format } from 'date-fns'
  import { parseISO } from 'date-fns/fp'
  import ConfirmModal from '../components/modals/ConfirmModal.vue'

  export default defineComponent({
    components: { SongList, Loading, ConfirmModal },
    setup() {
      const toast = useToast()
      const { user } = useAuth()
      const store = useStore<State>()
      const loading = computed(() => store.state.userStore.loading)
      const tracks = computed(() => {
        return store.state.userStore.tracks
      })

      const playlist = computed(() => {
        return user.value?.playlist
      })

      const created = ref(false)
      const name = ref('Spotify Liked')
      const description = ref('A playlist with all my liked songs on spotify.')
      const isPublic = ref(true)
      const sync = ref(true)
      const createLoading = ref(false)

      const closeModal = () => {
        const modalCheckbox = document.querySelector(
          '.modal-toggle'
        ) as HTMLInputElement
        if (modalCheckbox) modalCheckbox.checked = false
      }

      const createPlaylist = async () => {
        createLoading.value = true
        try {
          const payload = {
            name: name.value,
            description: description.value,
            isPublic: isPublic.value,
            sync: sync.value,
          }

          // Await fake promise for now
          const response = await API.execute('POST', 'users/playlist', payload)

          if (response.status === 201) {
            // refetch user
            await store.dispatch('userStore/fetch')

            // Show success message
            toast.success('Playlist created successfully')

            // Close modal
            closeModal()
          } else {
            // Show error message
            toast.error(`Something went wrong: ${response.data}`)
          }

          created.value = true
        } catch (error) {
          toast.error(error?.response?.data?.message ?? 'UNKNOWN')
          console.error(error)
        } finally {
          createLoading.value = false
        }
      }

      const totalDuration = computed(() => {
        if (!tracks.value) return 0
        return tracks.value.reduce((acc, track) => {
          return acc + track?.track?.duration_ms ?? 0
        }, 0)
      })

      const login = async () => {
        try {
          const response = await API.execute('POST', 'users/spotify', {})

          if (response.status === 200) {
            window.location.href = response.data.redirect_url
            return
          }
        } catch (error) {
          console.info('API error: ', error)
          toast.error('Something went wrong!')
        }
      }

      const lastUpdated = computed(() => {
        if (!playlist.value?.lastUpdated) return '_'
        return format(parseISO(playlist.value?.lastUpdated), 'yyyy-MM-dd HH:mm')
      })
      const showConfirmDelete = ref(false)
      const deleteLoading = ref(false)

      const confirmDelete = () => {
        showConfirmDelete.value = true
      }

      const deletePlaylist = async () => {
        deleteLoading.value = true
        try {
          await store.dispatch('userStore/deletePlaylist')
          toast.success('Playlist deleted')
          close()
        } catch (error) {
          console.error(error)
        } finally {
          deleteLoading.value = false
        }
      }

      const close = () => {
        showConfirmDelete.value = false
      }
      return {
        login,
        user,
        tracks,
        totalDuration,
        loading,
        customFormatDuration,
        name,
        description,
        isPublic,
        sync,
        createLoading,
        createPlaylist,
        playlist,
        created,
        closeModal,
        lastUpdated,
        confirmDelete,
        deletePlaylist,
        showConfirmDelete,
        close,
        deleteLoading,
      }
    },
  })
</script>

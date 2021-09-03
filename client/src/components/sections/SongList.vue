<template>
  <div class="my-4 shadow-sm">
    <div class="flex border-b border-base-100 bg-base-200">
      <div
        class="flex-1 px-6 py-3 text-xs font-medium tracking-wider text-left uppercase  text-neutral-content"
      >
        Song name
      </div>
      <div
        scope="col"
        class="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase  text-neutral-content"
      >
        Added on
      </div>
    </div>
    <DynamicScroller
      :items="songs"
      :min-item-size="10"
      class="min-w-full scroller"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.track?.name]"
          :data-index="index"
          class="border-b border-base-300 bg-base-200"
        >
          <div
            class="flex items-center px-6 py-4 align-middle whitespace-nowrap"
          >
            <div class="pr-4">
              <img
                :src="item.track.album.images[0].url"
                class="h-12 mask mask-square"
              />
            </div>
            <div class="flex-1">
              <span class="font-medium text-primary">
                {{ item.track?.name }}
              </span>
              -
              <span>
                {{ item.track?.artists.map((a) => a.name).join(', ') }}</span
              >
            </div>
            <div class="opacity-60">
              {{ formatTime(item.added_at) }}
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
  import { formatDistanceToNow, parseISO } from 'date-fns'
  import { computed, defineComponent, State } from 'vue'
  import { useStore } from 'vuex'

  export default defineComponent({
    setup() {
      const store = useStore<State>()
      const songs = computed(() =>
        store.state.userStore.tracks.map((track) => ({
          ...track,
          id: track.track.id,
        }))
      )

      const formatTime = (date: string) => {
        return formatDistanceToNow(parseISO(date), { addSuffix: true })
      }
      return {
        songs,
        formatTime,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .scroller {
    height: 40vh;
  }
</style>

<template>
  <input :id="id" :value="modalStatus" type="checkbox" class="modal-toggle" />
  <div ref="modal" class="modal">
    <div class="modal-box">
      <slot></slot>
      <div class="modal-action">
        <slot name="actions">
          <slot
            :id="id"
            name="confirm"
            :showConfirm="showConfirm"
            :callback="callback"
            :loading="loading"
          >
            <button
              v-if="showConfirm"
              class="btn btn-primary"
              :class="{
                loading: loading,
              }"
              :disabled="loading"
              @click="callback"
            >
              Accept
            </button>
          </slot>
          <slot :id="id" name="cancel" showClose="showClose" :close="close">
            <button v-if="showClose" class="btn" @click="close">Close</button>
          </slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { watch, computed, defineComponent, toRefs, ref } from 'vue'

  export default defineComponent({
    name: 'Modal',
    props: {
      id: {
        type: String,
        required: true,
      },
      hideClose: {
        type: Boolean,
        default: false,
      },
      hideConfirm: {
        type: Boolean,
        default: false,
      },
      modalStatus: {
        type: Boolean,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['confirm', 'close'],
    setup(props, { emit }) {
      const { hideClose, hideConfirm, modalStatus } = toRefs(props)
      const modal = ref<HTMLElement>()
      const showConfirm = computed(() => {
        return !hideConfirm.value
      })

      const showClose = computed(() => {
        return !hideClose.value
      })

      const callback = () => {
        emit('confirm')
      }

      const close = () => {
        emit('close')
      }

      watch(modalStatus, (newValue) => {
        if (!modal.value) {
          console.error('Modal not found')
          return
        }
        if (newValue) {
          modal.value.classList.add('modal-open')
          return
        }
        modal.value.classList.remove('modal-open')
      })

      return {
        showConfirm,
        showClose,
        callback,
        close,
        modal,
      }
    },
  })
</script>

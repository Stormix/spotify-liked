<template>
  <modal
    :id="id"
    :modal-status="modalStatus"
    :loading="loading"
    @close="close"
    @confirm="confirm"
  >
    <div class="modal-header">
      <h3 class="mb-4 text-2xl font-bold">{{ title }}</h3>
    </div>
    <div class="break-words whitespace-normal">
      {{ message }}
    </div>
    <template #confirm="props">
      <button
        class="btn btn-error"
        :class="{
          loading: props.loading,
        }"
        :disabled="props.loading"
        @click="props.callback"
      >
        Confirm
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Modal from './Modal.vue'

  export default defineComponent({
    components: { Modal },
    props: {
      id: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      modalStatus: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: 'Are you sure about that?',
      },

      loading: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['confirm', 'close'],
    setup(props, { emit }) {
      const close = () => {
        console.log('Sent to parent 2')

        emit('close')
      }

      const confirm = () => {
        emit('confirm')
      }

      return {
        close,
        confirm,
      }
    },
  })
</script>

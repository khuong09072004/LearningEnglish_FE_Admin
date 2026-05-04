<template>
  <a-modal
    :title="isEditMode ? 'Sua bai tap' : 'Them bai tap'"
    :visible="visible"
    :confirm-loading="submitLoading"
    :ok-text="isEditMode ? 'Cap nhat' : 'Tao moi'"
    cancel-text="Huy"
    width="860px"
    @ok="$emit('submit')"
    @cancel="$emit('close')"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="space-y-4">
        <a-form layout="vertical">
          <a-form-item label="File audio">
            <a-upload
              :file-list="audioFileList"
              :before-upload="() => false"
              :multiple="false"
              @change="$emit('audio-change', $event)"
              :remove="onRemoveAudio"
            >
              <a-button icon="upload">Chon file audio</a-button>
            </a-upload>
            <div v-if="currentAudioUrl" class="mt-2 text-xs text-gray-500 break-all">
              Audio hien tai: {{ currentAudioUrl }}
            </div>
          </a-form-item>
        </a-form>
      </div>

      <div>
        <div class="text-sm font-medium text-gray-700 mb-2">req JSON</div>
        <a-textarea
          :value="reqJsonText"
          :rows="18"
          placeholder='Nhap JSON cho truong req, vi du {"title":"..."}'
          @input="$emit('change-req-json', $event.target.value)"
        />
        <p class="mt-2 text-xs text-gray-500">
          Du lieu se duoc gui duoi dang multipart/form-data voi key <span class="font-medium">req</span> va <span class="font-medium">audioFile</span>.
        </p>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "ExerciseModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    reqJsonText: {
      type: String,
      default: "{}",
    },
    audioFileList: {
      type: Array,
      default: () => [],
    },
    currentAudioUrl: {
      type: String,
      default: "",
    },
  },
  methods: {
    onRemoveAudio() {
      this.$emit('remove-audio');
      return false;
    },
  },
};
</script>

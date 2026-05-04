<template>
  <a-modal
    title="Sua exercise-item"
    :visible="visible"
    :confirm-loading="submitLoading"
    ok-text="Cap nhat"
    cancel-text="Huy"
    width="760px"
    @ok="$emit('submit')"
    @cancel="$emit('close')"
  >
    <div class="text-sm font-medium text-gray-700 mb-2">JSON item</div>
    <a-textarea
      :value="jsonText"
      :rows="18"
      placeholder="Nhap JSON cho exercise-item"
      @input="$emit('change-json', $event.target.value)"
    />
    <p class="mt-2 text-xs text-gray-500">
      Chuc nang hien tai chi ho tro sua / xoa exercise-item vi API tao moi chua duoc cung cap.
    </p>
  </a-modal>
</template>

<script>
export default {
  name: "ItemModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    jsonText: {
      type: String,
      default: "{}",
    },
  },
};
</script>

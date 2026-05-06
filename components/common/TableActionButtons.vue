<template>
  <div class="flex items-center justify-center gap-3">
    <a-tooltip v-if="showView" :title="viewText">
      <a-button type="link" icon="eye" class="text-green-600 p-0" @click="$emit('view')" />
    </a-tooltip>

    <a-tooltip :title="editText">
      <a-button type="link" icon="edit" class="text-blue-500 p-0" @click="$emit('edit')" />
    </a-tooltip>

    <a-tooltip :title="deleteText">
      <a-popconfirm
        :title="deleteConfirmTitle"
        :ok-text="deleteText"
        :cancel-text="cancelText"
        @confirm="$emit('delete')"
      >
        <a-button type="link" icon="delete" class="text-red-500 p-0" />
      </a-popconfirm>
    </a-tooltip>
  </div>
</template>

<script>
export default {
  name: "TableActionButtons",
  props: {
    showView: {
      type: Boolean,
      default: false,
    },
    viewText: {
      type: String,
      default: "Xem chi tiết",
    },
    editText: {
      type: String,
      default: "Chỉnh sửa",
    },
    deleteText: {
      type: String,
      default: "Xóa",
    },
    cancelText: {
      type: String,
      default: "Hủy",
    },
    deleteConfirmTitle: {
      type: String,
      default: "Bạn có chắc muốn xóa bản ghi này?",
    },
  },
};
</script>

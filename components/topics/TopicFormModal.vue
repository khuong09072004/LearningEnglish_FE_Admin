<template>
  <a-modal
    :title="isEditMode ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề'"
    :visible="visible"
    :confirm-loading="submitLoading"
    :ok-text="isEditMode ? 'Cập nhật' : 'Tạo mới'"
    cancel-text="Hủy"
    @ok="handleSubmit"
    @cancel="$emit('close')"
  >
    <a-form layout="vertical">
      <a-form-item label="Tên chủ đề">
        <a-input v-model="localForm.name" placeholder="Nhập tên chủ đề" :max-length="100" />
      </a-form-item>

      <a-form-item label="Cấp độ">
        <a-select v-model="localForm.levelId" placeholder="Chọn cấp độ">
          <a-select-option v-for="item in levelOptions" :key="item.id" :value="item.id">
            {{ item.code || item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "TopicFormModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({ name: "", levelId: undefined }),
    },
    levelOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localForm: {
        name: "",
        levelId: undefined,
      },
    };
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.localForm = {
          name: value?.name || "",
          levelId: value?.levelId || undefined,
        };
      },
    },
    visible(value) {
      if (value) {
        this.localForm = {
          name: this.form?.name || "",
          levelId: this.form?.levelId || undefined,
        };
      }
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("submit", {
        name: (this.localForm.name || "").trim(),
        levelId: this.localForm.levelId,
      });
    },
  },
};
</script>

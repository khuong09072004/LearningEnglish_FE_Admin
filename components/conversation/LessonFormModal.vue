<template>
  <a-modal
    :visible="visible"
    :title="mode === 'create' ? 'Tạo bài học' : 'Sửa bài học'"
    @ok="onOk"
    @cancel="$emit('close')"
    :confirmLoading="loading"
    :width="560"
  >
    <a-form-model layout="vertical">
      <a-form-model-item label="Tiêu đề">
        <a-input v-model="localForm.title" placeholder="Nhập tiêu đề bài học" />
      </a-form-model-item>
      <a-form-model-item label="Mô tả">
        <a-textarea v-model="localForm.description" :rows="3" placeholder="Nhập mô tả" />
      </a-form-model-item>
      <a-form-model-item label="Level ID">
        <a-input-number v-model="localForm.levelId" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item label="Goal">
        <a-textarea v-model="localForm.goal" :rows="2" placeholder="Nhập goal" />
      </a-form-model-item>
      <a-form-model-item label="System Prompt">
        <a-textarea v-model="localForm.systemPrompt" :rows="4" placeholder="Nhập system prompt" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'LessonFormModal',
  props: {
    visible: { type: Boolean, default: false },
    mode: { type: String, default: 'create' },
    initial: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      localForm: {
        title: '',
        description: '',
        levelId: 1,
        goal: '',
        systemPrompt: '',
      },
    };
  },
  watch: {
    initial: {
      immediate: true,
      handler(v) {
        this.localForm = Object.assign({ title: '', description: '', levelId: 1, goal: '', systemPrompt: '' }, v || {});
      },
    },
    visible(v) {
      if (!v) {
        // reset when closed
        this.localForm = Object.assign({ title: '', description: '', levelId: 1, goal: '', systemPrompt: '' }, this.initial || {});
      }
    },
  },
  methods: {
    onOk() {
      this.$emit('save', this.localForm);
    },
  },
};
</script>

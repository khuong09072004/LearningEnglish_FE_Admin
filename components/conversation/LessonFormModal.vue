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
      <a-form-model-item label="Cấp độ">
        <a-select v-model="localForm.levelId" placeholder="Chọn cấp độ">
          <a-select-option v-for="item in levelOptions" :key="item.id" :value="item.id">
            {{ item.name || item.code || ('Level ' + item.id) }}
          </a-select-option>
        </a-select>
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
    levelOptions: { type: Array, default: () => [] },
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
      const title = String(this.localForm.title || '').trim();
      const description = String(this.localForm.description || '').trim();
      const goal = String(this.localForm.goal || '').trim();
      const systemPrompt = String(this.localForm.systemPrompt || '').trim();
      const levelId = this.localForm.levelId;

      if (!title || !description || !levelId || !goal || !systemPrompt) {
        this.$message.warning('Vui lòng nhập đầy đủ tất cả các trường.');
        return;
      }

      this.$emit('save', {
        ...this.localForm,
        title,
        description,
        goal,
        systemPrompt,
      });
    },
  },
};
</script>

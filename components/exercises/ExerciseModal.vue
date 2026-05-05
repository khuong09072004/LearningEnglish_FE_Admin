<template>
  <a-modal
    :title="isEditMode ? 'Sua bai tap' : 'Them bai tap'"
    :visible="visible"
    :confirm-loading="submitLoading"
    :ok-text="isEditMode ? 'Cap nhat' : 'Tao moi'"
    cancel-text="Huy"
    width="640px"
    @ok="handleSubmit"
    @cancel="$emit('close')"
  >
    <a-form :form="form" layout="vertical">
      <a-form-item v-if="isEditMode" label="ID bai tap">
        <a-input-number
          v-decorator="['id', { rules: [{ required: true, message: 'Vui long nhap ID' }] }]"
          :min="1"
          style="width: 100%"
          placeholder="Nhap ID bai tap can sua"
        />
      </a-form-item>

      <a-form-item label="Topic ID">
        <a-input-number
          v-decorator="['topicId', { rules: [{ required: true, message: 'Vui long nhap Topic ID' }] }]"
          :min="1"
          style="width: 100%"
          placeholder="Nhap Topic ID"
        />
      </a-form-item>

      <a-form-item label="Tieu de">
        <a-input
          v-decorator="['title', { rules: [{ required: true, message: 'Vui long nhap tieu de' }] }]"
          placeholder="Nhap tieu de bai tap"
        />
      </a-form-item>

      <div class="grid grid-cols-2 gap-4">
        <!-- Category chọn trước -->
        <a-form-item label="Category">
          <a-select
            v-decorator="['category', { rules: [{ required: true, message: 'Vui long chon category' }] }]"
            placeholder="Chon category"
            @change="onCategoryChange"
          >
            <a-select-option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</a-select-option>
          </a-select>
        </a-form-item>

        <!-- Type lọc theo category, disabled nếu chưa chọn category -->
        <a-form-item label="Type">
          <a-select
            v-decorator="['type', { rules: [{ required: true, message: 'Vui long chon type' }] }]"
            :placeholder="selectedCategory ? 'Chon type' : 'Chon category truoc'"
            :disabled="!selectedCategory"
          >
            <a-select-option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <a-form-item label="Thoi luong (phut)">
        <a-input-number
          v-decorator="['duration', { rules: [{ required: true, message: 'Vui long nhap thoi luong' }] }]"
          :min="1"
          style="width: 100%"
          placeholder="Nhap thoi luong"
        />
      </a-form-item>

      <!-- Chỉ hiện khi category là LISTENING -->
      <a-form-item v-if="isListening" label="File audio">
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
  </a-modal>
</template>

<script>
const CATEGORY_TYPE_MAP = {
  VOCAB: ["VOCAB_MATCH", "VOCAB_MEANING_CHOICE", "VOCAB_PHONETIC", "VOCAB_PATTERN_FILL"],
  GRAMMAR: ["GRAMMAR_MCQ", "GRAMMAR_SENTENCE_CHOICE", "GRAMMAR_FIND_ERROR", "GRAMMAR_REORDER", "GRAMMAR_REWRITE"],
  READING: ["READ_MCQ", "READ_QA", "READ_FILL"],
  LISTENING: ["LISTEN_FILL", "LISTEN_QA"],
  WRITING: ["WRITE_REORDER", "WRITE_REWRITE", "WRITE_FIX", "WRITE_REORDER_GROUP"],
};

const CATEGORY_OPTIONS = ["VOCAB", "GRAMMAR", "READING", "LISTENING", "WRITING"];

export default {
  name: "ExerciseModal",
  props: {
    visible: { type: Boolean, default: false },
    isEditMode: { type: Boolean, default: false },
    submitLoading: { type: Boolean, default: false },
    audioFileList: { type: Array, default: () => [] },
    currentAudioUrl: { type: String, default: "" },
    initialValues: { type: Object, default: () => ({}) },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      categoryOptions: CATEGORY_OPTIONS,
      selectedCategory: null,
      isListening: false,
    };
  },
  computed: {
    typeOptions() {
      if (!this.selectedCategory) return [];
      return CATEGORY_TYPE_MAP[this.selectedCategory] || [];
    },
  },
  watch: {
    visible(val) {
      if (val) {
        const category = this.initialValues?.category || null;
        this.selectedCategory = category;
        this.isListening = category === "LISTENING";
        this.$nextTick(() => {
          this.form.setFieldsValue({
            id: this.initialValues?.id || undefined,
            topicId: this.initialValues?.topicId || undefined,
            title: this.initialValues?.title || "",
            type: this.initialValues?.type || undefined,
            category: category || undefined,
            duration: this.initialValues?.duration || undefined,
          });
        });
      } else {
        this.isListening = false;
        this.selectedCategory = null;
        this.form.resetFields();
        this.$emit("remove-audio");
      }
    },
  },
  methods: {
    onCategoryChange(value) {
      this.selectedCategory = value;
      this.isListening = value === "LISTENING";
      // Reset type vì type cũ không còn hợp lệ với category mới
      this.form.setFieldsValue({ type: undefined });
      if (!this.isListening) {
        this.$emit("remove-audio");
      }
    },
    onRemoveAudio() {
      this.$emit("remove-audio");
      return false;
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (err) return;
        const { id, ...params } = values;
        if (!this.isListening) {
          params.audioFile = null;
        }
        this.$emit("submit", { id, params });
      });
    },
  },
};
</script>
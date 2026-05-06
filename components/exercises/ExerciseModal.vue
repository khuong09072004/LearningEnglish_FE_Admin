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

      <a-form-item label="Topic">
        <a-select
          v-decorator="['topicId', { rules: [{ required: true, message: 'Vui long chon topic' }] }]"
          :loading="topicsLoading"
          placeholder="Chon topic"
          show-search
          :filter-option="filterTopicOption"
        >
          <a-select-option v-for="t in topicOptions" :key="t.id" :value="t.id">
            {{ t.name }}
          </a-select-option>
        </a-select>
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
            @change="onTypeChange"
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

      <a-form-item v-if="isReading" label="Passage">
        <a-select
          v-decorator="['passageId', { rules: [{ required: true, message: 'Vui long chon passage' }] }]"
          :loading="passagesLoading"
          placeholder="Chon passage"
          show-search
          :filter-option="filterPassageOption"
        >
          <a-select-option v-for="p in passageOptions" :key="p.id" :value="p.id">
            {{ p.title }}
          </a-select-option>
        </a-select>
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
import { getListPassage } from "@/apis/passages";
import { getListTopic } from "@/apis/topics";

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
      selectedType: null,
      isListening: false,
      isReading: false,
      topicsLoading: false,
      topicOptions: [],
      passagesLoading: false,
      passageOptions: [],
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
        const type = this.initialValues?.type || null;
        const passageId =
          this.initialValues?.passageId ||
          this.initialValues?.passingId ||
          this.initialValues?.passedId ||
          this.initialValues?.passage_id ||
          this.initialValues?.passage?.id ||
          this.initialValues?.passage?.passageId ||
          this.initialValues?.passage?.passingId ||
          this.initialValues?.passage?.passedId ||
          this.initialValues?.question?.passage_id ||
          this.initialValues?.question?.passageId ||
          this.initialValues?.question?.passingId ||
          this.initialValues?.question?.passedId ||
          this.initialValues?.raw?.passageId ||
          this.initialValues?.raw?.passingId ||
          this.initialValues?.raw?.passedId ||
          this.initialValues?.raw?.passage_id ||
          undefined;
        this.selectedCategory = category;
        this.selectedType = type;
        this.isListening = category === "LISTENING";
        this.isReading = category === "READING" || String(type || "").startsWith("READ_");
        this.fetchTopics();
        this.fetchPassages();
        this.$nextTick(() => {
          this.form.setFieldsValue({
            id: this.initialValues?.id || undefined,
            topicId: this.initialValues?.topicId || undefined,
            title: this.initialValues?.title || "",
            type: type || undefined,
            category: category || undefined,
            duration: this.initialValues?.duration || undefined,
            passageId:
              passageId === undefined || passageId === null || passageId === ""
                ? undefined
                : String(passageId),
          });
        });
      } else {
        this.isListening = false;
        this.isReading = false;
        this.selectedCategory = null;
        this.selectedType = null;
        this.form.resetFields();
        this.$emit("remove-audio");
      }
    },
  },
  methods: {
    onCategoryChange(value) {
      this.selectedCategory = value;
      this.isListening = value === "LISTENING";
      this.isReading = value === "READING" || String(this.selectedType || "").startsWith("READ_");
      // Reset type vì type cũ không còn hợp lệ với category mới
      this.selectedType = null;
      this.form.setFieldsValue({ type: undefined, passageId: undefined });
      if (!this.isListening) {
        this.$emit("remove-audio");
      }
    },
    onTypeChange(value) {
      this.selectedType = value;
      const isReadingByType = String(value || "").startsWith("READ_");
      this.isReading = this.selectedCategory === "READING" || isReadingByType;
      if (!this.isReading) {
        this.form.setFieldsValue({ passageId: undefined });
      }
    },
    async fetchTopics() {
      if (this.topicOptions.length) return;
      this.topicsLoading = true;
      try {
        const res = await getListTopic();
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.result)) list = res.result;

        this.topicOptions = list
          .map((t) => {
            const id = t?.id || t?._id || t?.topicId;
            return {
              id,
              name: t?.name || t?.title || t?.topicName || `Topic ${id || ""}`,
            };
          })
          .filter((t) => !!t.id);
      } catch (error) {
        this.$message.error("Khong the tai danh sach topic");
      } finally {
        this.topicsLoading = false;
      }
    },
    filterTopicOption(input, option) {
      const text = String(option?.componentOptions?.children?.[0]?.text || "").toLowerCase();
      return text.includes(String(input || "").toLowerCase());
    },
    async fetchPassages() {
      if (this.passageOptions.length) return;
      this.passagesLoading = true;
      try {
        const res = await getListPassage();
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.result)) list = res.result;

        this.passageOptions = list
          .map((p) => {
            const id = p?.id || p?._id || p?.passageId;
            return {
              id: id === undefined || id === null ? undefined : String(id),
              title: p?.title || p?.name || `Passage ${id || ""}`,
            };
          })
          .filter((p) => !!p.id);
      } catch (error) {
        this.$message.error("Khong the tai danh sach passage");
      } finally {
        this.passagesLoading = false;
      }
    },
    filterPassageOption(input, option) {
      const text = String(option?.componentOptions?.children?.[0]?.text || "").toLowerCase();
      return text.includes(String(input || "").toLowerCase());
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
        if (!this.isReading) {
          params.passageId = null;
        }
        this.$emit("submit", { id, params });
      });
    },
  },
};
</script>
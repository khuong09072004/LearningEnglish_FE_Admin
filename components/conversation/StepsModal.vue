<template>
  <a-modal
    :visible="visible"
    :title="lesson ? `Steps - ${lesson.title}` : 'Steps'"
    @cancel="onClose"
    :footer="null"
    :width="760"
  >
    <div class="steps-modal-header mb-3 flex items-center justify-between">
      <div>
        <div class="steps-title text-2xl font-bold">Danh sách steps</div>
      </div>
      <a-button type="primary" @click="openAddChoice">+ Thêm step</a-button>
    </div>

    <div v-if="lesson">
      <div v-if="Array.isArray(lesson.steps) && lesson.steps.length">
        <a-table
          :dataSource="lesson.steps"
          :columns="columns"
          :rowKey="'id'"
          size="small"
          bordered
          :pagination="false"
        >
          <template slot="stepAction" slot-scope="text, record">
            <a-tooltip title="Sửa">
              <a-button size="small" type="link" icon="edit" @click="onEdit(record)" class="action-btn action-edit" />
            </a-tooltip>
            <a-tooltip title="Xóa">
              <a-button size="small" type="link" icon="delete" @click="onDelete(record)" class="action-btn action-delete" />
            </a-tooltip>
          </template>
        </a-table>
      </div>
      <a-empty v-else description="Không có bước nào" />
    </div>

    <!-- Add choice modal -->
    <a-modal v-model="addChoiceModalVisible" title="Thêm step" :footer="null">
      <div class="flex flex-col gap-3">
        <a-button type="default" block @click="openManualAdd">1. Nhập thủ công</a-button>
        <a-button type="primary" block @click="openSuggestModal">2. Gợi ý AI</a-button>
      </div>
    </a-modal>

    <!-- Suggest modal -->
    <a-modal v-model="suggestModalVisible" title="Gợi ý steps từ AI" @cancel="closeSuggestModal" :width="720" :footer="null">
      <div class="mb-3">
        <a-input-number v-model="suggestCount" :min="1" :max="20" />
        <a-button class="ml-2" type="primary" @click="requestSuggestions" :loading="suggestLoading">Gợi ý</a-button>
      </div>

      <div v-if="suggestions && suggestions.length">
        <a-table :dataSource="suggestions" :columns="suggestColumns" :rowKey="'stepOrder'" size="small" :pagination="false">
        </a-table>
        <div class="mt-3 flex justify-end">
          <a-button type="primary" @click="importSuggestions" :loading="importing">Nhập tất cả</a-button>
        </div>
      </div>
      <div v-else-if="!suggestLoading">
        <a-empty description="Chưa có gợi ý" />
      </div>
    </a-modal>

    <!-- internal step modal -->
    <a-modal
      :visible="stepModalVisible"
      :title="editingStep ? 'Sửa step' : 'Thêm step'"
      @ok="onSaveStep"
      @cancel="closeStepModal"
      :confirmLoading="stepSaving"
      :width="520"
    >
      <a-form-model layout="vertical">
        <a-form-model-item label="Step Order">
          <a-input-number v-model="stepForm.stepOrder" :min="1" style="width: 100%" />
        </a-form-model-item>
        <a-form-model-item label="AI Role">
          <a-input v-model="stepForm.aiRole" placeholder="VD: Barista, Receptionist..." />
        </a-form-model-item>
        <a-form-model-item label="User Task">
          <a-textarea v-model="stepForm.userTask" :rows="2" placeholder="Nhiệm vụ người dùng cần làm" />
        </a-form-model-item>
        <a-form-model-item label="Grammar Focus">
          <a-input v-model="stepForm.grammarFocus" placeholder="VD: Greetings, Polite requests..." />
        </a-form-model-item>
        <a-form-model-item label="Sample Answer">
          <a-textarea v-model="stepForm.sampleAnswer" :rows="2" placeholder="Câu trả lời mẫu" />
        </a-form-model-item>
        <a-form-model-item label="Max Attempts">
          <a-input-number v-model="stepForm.maxAttempts" :min="1" style="width: 100%" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-modal>
</template>

<script>
import { suggestSteps, createStepsBulk } from '@/apis/conversation';

export default {
  name: 'StepsModal',
  props: {
    visible: { type: Boolean, default: false },
    lesson: { type: Object, default: null },
  },
  data() {
    return {
      // internal step modal
      stepModalVisible: false,
      editingStep: null,
      stepForm: {
        stepOrder: 1,
        aiRole: '',
        userTask: '',
        grammarFocus: '',
        sampleAnswer: '',
        maxAttempts: 3,
      },
      stepSaving: false,

      // add choice modal
      addChoiceModalVisible: false,

      // suggest modal
      suggestModalVisible: false,
      suggestCount: 3,
      suggestLoading: false,
      suggestions: [],
      importing: false,
    };
  },
  computed: {
    columns() {
      return [
        { title: '#', dataIndex: 'stepOrder', key: 'stepOrder', width: 50 },
        { title: 'AI Role', dataIndex: 'aiRole', key: 'aiRole', width: 150 },
        { title: 'User Task', dataIndex: 'userTask', key: 'userTask', ellipsis: true },
        { title: 'Grammar Focus', dataIndex: 'grammarFocus', key: 'grammarFocus', width: 150 },
        { title: 'Sample Answer', dataIndex: 'sampleAnswer', key: 'sampleAnswer', ellipsis: true },
        { title: 'Max Attempts', dataIndex: 'maxAttempts', key: 'maxAttempts', width: 110 },
        { title: 'Hành động', key: 'stepAction', scopedSlots: { customRender: 'stepAction' }, width: 130 },
      ];
    },
    suggestColumns() {
      return [
        { title: '#', dataIndex: 'stepOrder', key: 'stepOrder', width: 50 },
        { title: 'AI Role', dataIndex: 'aiRole', key: 'aiRole', width: 150 },
        { title: 'User Task', dataIndex: 'userTask', key: 'userTask', ellipsis: true },
        { title: 'Grammar Focus', dataIndex: 'grammarFocus', key: 'grammarFocus', width: 150 },
        { title: 'Sample Answer', dataIndex: 'sampleAnswer', key: 'sampleAnswer', ellipsis: true },
        { title: 'Max Attempts', dataIndex: 'maxAttempts', key: 'maxAttempts', width: 110 },
      ];
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    openAddChoice() {
      this.addChoiceModalVisible = true;
    },
    openManualAdd() {
      this.addChoiceModalVisible = false;
      this.editingStep = null;
      this.stepForm = this.createEmptyStepForm();
      this.stepModalVisible = true;
    },
    openSuggestModal() {
      this.addChoiceModalVisible = false;
      this.suggestions = [];
      this.suggestModalVisible = true;
    },
    closeSuggestModal() {
      this.suggestModalVisible = false;
    },
    onEdit(step) {
      this.editingStep = step;
      this.stepForm = this.createStepFormFromRecord(step);
      this.stepModalVisible = true;
    },
    onDelete(step) {
      this.$emit('delete-step', step);
    },
    closeStepModal() {
      this.stepModalVisible = false;
    },
    async onSaveStep() {
      this.stepSaving = true;
      try {
        const form = this.normalizeStepPayload(this.stepForm);

        this.$emit('save-step', { editingStep: this.editingStep, form });
        this.stepModalVisible = false;
      } catch (e) {
      } finally {
        this.stepSaving = false;
      }
    },

    // Suggest functions
    createEmptyStepForm() {
      return {
        stepOrder: 1,
        aiRole: '',
        userTask: '',
        grammarFocus: '',
        sampleAnswer: '',
        maxAttempts: 3,
      };
    },

    createStepFormFromRecord(step) {
      const normalized = this.normalizeStepPayload(step || {});
      return Object.assign(this.createEmptyStepForm(), normalized);
    },

    normalizeStepPayload(step) {
      const payload = {
        stepOrder: Math.max(1, Number(step?.stepOrder) || 1),
        aiRole: step?.aiRole || '',
        userTask: step?.userTask || '',
        grammarFocus: step?.grammarFocus || '',
        sampleAnswer: step?.sampleAnswer || '',
        maxAttempts: Math.max(1, Number(step?.maxAttempts) || 1),
      };

      return payload;
    },

    async requestSuggestions() {
      if (!this.lesson || !this.lesson.id) return this.$message.error('Lesson chưa chọn');
      this.suggestLoading = true;
      this.suggestions = [];
      try {
        const res = await suggestSteps(this.lesson.id, this.suggestCount);
        const payload = res?.data?.data ?? res?.data ?? res;
        // payload.raw expected to contain a code block with JSON
        const raw = payload?.raw || payload?.suggestions || '';
        let parsed = [];
        if (typeof raw === 'string') {
          // try to extract JSON between ```
          const triple = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
          const jsonText = triple ? triple[1] : raw;
          try {
            parsed = JSON.parse(jsonText);
          } catch (e) {
            // try to locate first '[' .. ']' substring
            const arrMatch = jsonText.match(/\[([\s\S]*)\]/);
            if (arrMatch) {
              try {
                parsed = JSON.parse('[' + arrMatch[1] + ']');
              } catch (e2) {
                parsed = [];
              }
            }
          }
        } else if (Array.isArray(payload?.suggestions) && payload.suggestions.length) {
          parsed = payload.suggestions;
        }

        if (!Array.isArray(parsed)) parsed = [];
        this.suggestions = this.normalizeSuggestedSteps(parsed);
      } catch (e) {
        this.$message.error('Gợi ý thất bại');
      } finally {
        this.suggestLoading = false;
      }
    },

    normalizeSuggestedSteps(steps) {
      if (!Array.isArray(steps)) return [];

      return steps
        .map((step, index) => ({
          stepOrder: Number(step?.stepOrder ?? index + 1),
          aiRole: step?.aiRole || '',
          userTask: step?.userTask || '',
          grammarFocus: step?.grammarFocus || '',
          sampleAnswer: step?.sampleAnswer || '',
          maxAttempts: Number(step?.maxAttempts ?? 3),
        }))
        .filter((step) => step.userTask || step.aiRole || step.sampleAnswer);
    },

    async importSuggestions() {
      if (!this.lesson || !this.lesson.id) return this.$message.error('Lesson chưa chọn');
      if (!this.suggestions || !this.suggestions.length) return this.$message.error('Không có gợi ý để nhập');
      this.importing = true;
      try {
        const payload = this.normalizeSuggestedSteps(this.suggestions);
        await createStepsBulk(this.lesson.id, payload);
        this.$message.success('Nhập các bước gợi ý thành công');
        this.suggestModalVisible = false;
        // notify parent to refresh
        this.$emit('import-complete', this.lesson.id);
      } catch (e) {
        this.$message.error('Không thể nhập các bước');
      } finally {
        this.importing = false;
      }
    },
  },
};
</script>

<style scoped>
.action-btn { padding: 0; width: 28px; height: 28px; margin-right: 6px; }
.action-edit { color: #1890ff; }
.action-delete { color: #ff4d4f; }
</style>

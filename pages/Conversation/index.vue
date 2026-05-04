<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Conversation Lessons</h1>
        <p class="text-sm text-gray-500 mt-1">Danh sách bài học hội thoại trong hệ thống</p>
      </div>

      <div class="flex items-center gap-2">
        
        <a-button type="primary" icon="plus" @click="openLessonModal('create')">Thêm bài học</a-button>
      </div>
    </div>

    <lesson-table
      :lessons="lessons"
      :lessonsLoading="lessonsLoading"
      @edit="openLessonModal('edit', $event)"
      @delete="handleDeleteLessonRecord"
      @view-steps="openStepsModal"
    />

    <lesson-form-modal
      :visible="lessonModalVisible"
      :mode="lessonModalMode"
      :initial="lessonForm"
      :loading="submitLoading"
      @save="saveLessonFromModal"
      @close="lessonModalVisible = false"
    />

    <steps-modal
      :visible="stepsModalVisible"
      :lesson="selectedLessonForSteps"
      @save-step="handleSaveStep"
      @delete-step="handleDeleteStepFromModal"
      @import-complete="handleImportComplete"
      @close="stepsModalVisible = false"
    />

    <!-- Step modal moved into StepsModal component -->
  </div>
</template>

<script>
import {
  getLessons,
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  createStep,
  updateStep,
  deleteStep,
} from "@/apis/conversation";

import LessonTable from '@/components/conversation/LessonTable.vue';
import LessonFormModal from '@/components/conversation/LessonFormModal.vue';
import StepsModal from '@/components/conversation/StepsModal.vue';

const defaultLessonForm = () => ({
  title: "",
  description: "",
  levelId: 1,
  goal: "",
  systemPrompt: "",
});

const defaultStepForm = () => ({
  stepOrder: 1,
  aiRole: "",
  userTask: "",
  grammarFocus: "",
  sampleAnswer: "",
  maxAttempts: 3,
});

export default {
  name: "ConversationPage",
  layout: "admin",
  components: {
    LessonTable,
    LessonFormModal,
    StepsModal,
  },
  data() {
    return {
      lessons: [],
      searchKeyword: "",
      loading: false,
      lessonsLoading: false,
      submitLoading: false,

      tableColumns: [
        { title: "ID", dataIndex: "id", key: "id", width: 60 },
        { title: "Tiêu đề", dataIndex: "title", key: "title" },
        { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
        { title: "Level", dataIndex: "levelName", key: "levelName", scopedSlots: { customRender: "levelName" }, width: 110 },
        { title: "Skill", dataIndex: "skillFocus", key: "skillFocus", scopedSlots: { customRender: "skillFocus" }, width: 110 },
        { title: "Số steps", key: "stepsCount", customRender: (text, record) => record.steps ? record.steps.length : 0, width: 90 },
        { title: "Hành động", key: "action", scopedSlots: { customRender: "action" }, width: 200 },
      ],

      stepColumns: [
        { title: "#", dataIndex: "stepOrder", key: "stepOrder", width: 50 },
        { title: "AI Role", dataIndex: "aiRole", key: "aiRole", width: 150 },
        { title: "User Task", dataIndex: "userTask", key: "userTask", ellipsis: true },
        { title: "Grammar Focus", dataIndex: "grammarFocus", key: "grammarFocus", width: 150 },
        { title: "Sample Answer", dataIndex: "sampleAnswer", key: "sampleAnswer", ellipsis: true },
        { title: "Max Attempts", dataIndex: "maxAttempts", key: "maxAttempts", width: 110 },
        { title: "Hành động", key: "stepAction", scopedSlots: { customRender: "stepAction" }, width: 130 },
      ],

      rowKey: "id",

      // lesson modal
      lessonModalVisible: false,
      lessonModalMode: "create",
      lessonForm: defaultLessonForm(),
      editingLessonId: null,

      // steps modal
      stepsModalVisible: false,
      selectedLessonForSteps: null,

      // step edit modal (moved into StepsModal component)
    };
  },

  created() {
    this.fetchLessons();
  },

  computed: {
    filteredLessons() {
      const keyword = (this.searchKeyword || "").trim().toLowerCase();
      if (!keyword) return this.lessons;

      return this.lessons.filter((lesson) => {
        const haystack = [lesson?.title, lesson?.description, lesson?.skillFocus, lesson?.levelName, lesson?.goal]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(keyword);
      });
    },

    totalStepsCount() {
      return this.lessons.reduce((total, lesson) => total + (Array.isArray(lesson.steps) ? lesson.steps.length : 0), 0);
    },

    lessonsWithStepsCount() {
      return this.lessons.filter((lesson) => Array.isArray(lesson.steps) && lesson.steps.length > 0).length;
    },
  },

  methods: {
    async fetchLessons() {
      this.lessonsLoading = true;
      try {
        const res = await getLessons();
        // API trả về { status, code, data: [...] }
        const data = res?.data?.data ?? res?.data ?? res;
        this.lessons = Array.isArray(data) ? data : [];
      } catch (error) {
        this.$message.error("Không thể tải danh sách bài học");
      } finally {
        this.lessonsLoading = false;
      }
    },

    openLessonModal(mode, record) {
      this.lessonModalMode = mode;
      if (mode === "edit" && record) {
        this.editingLessonId = record.id;
        this.lessonForm = {
          title: record.title || "",
          description: record.description || "",
          levelId: record.levelId || 1,
          goal: record.goal || "",
          systemPrompt: record.systemPrompt || "",
        };
      } else {
        this.editingLessonId = null;
        this.lessonForm = defaultLessonForm();
      }
      this.lessonModalVisible = true;
    },

    async saveLessonFromModal(form) {
      this.submitLoading = true;
      const payload = form || this.lessonForm;
      try {
        if (this.lessonModalMode === "create") {
          await createLesson(payload);
          this.$message.success("Tạo bài học thành công");
        } else {
          await updateLesson(this.editingLessonId, payload);
          this.$message.success("Cập nhật bài học thành công");
        }
        this.lessonModalVisible = false;
        await this.fetchLessons();
      } catch (error) {
        this.$message.error("Lưu bài học thất bại");
      } finally {
        this.submitLoading = false;
      }
    },

    handleDeleteLessonRecord(record) {
      const id = record?.id;
      if (!id) return;
      this.$confirm({
        title: "Xác nhận xóa",
        content: `Bạn có chắc muốn xóa bài học "${record.title}" không?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await deleteLesson(id);
            this.$message.success("Xóa bài học thành công");
            await this.fetchLessons();
          } catch {
            this.$message.error("Không thể xóa bài học");
          }
        },
      });
    },

    openStepsModal(record) {
      this.selectedLessonForSteps = record;
      this.stepsModalVisible = true;
    },

    async handleSaveStep(payload) {
      this.submitLoading = true;
      try {
        const lessonId = this.selectedLessonForSteps?.id;
        if (!lessonId) throw new Error("lessonId missing");

        const { editingStep, form } = payload || {};
        if (editingStep && editingStep.id) {
          await updateStep(lessonId, editingStep.id, form);
          this.$message.success("Cập nhật step thành công");
        } else {
          await createStep(lessonId, form);
          this.$message.success("Tạo step thành công");
        }

        await this.fetchLessons();
        try {
          const res = await getLessonById(lessonId);
          const data = res?.data?.data ?? res?.data ?? res;
          this.selectedLessonForSteps = data;
        } catch (e) {}
      } catch (error) {
        this.$message.error("Không thể lưu step");
      } finally {
        this.submitLoading = false;
      }
    },

    handleDeleteStepFromModal(step) {
      if (!step || !this.selectedLessonForSteps) return;
      this.$confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc muốn xóa step này không?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await deleteStep(this.selectedLessonForSteps.id, step.id);
            this.$message.success("Xóa step thành công");
            const res = await getLessonById(this.selectedLessonForSteps.id);
            const data = res?.data?.data ?? res?.data ?? res;
            this.selectedLessonForSteps = data;
            await this.fetchLessons();
          } catch {
            this.$message.error("Không thể xóa step");
          }
        },
      });
    },
    async handleImportComplete(lessonId) {
      try {
        await this.fetchLessons();
        const res = await getLessonById(lessonId);
        const data = res?.data?.data ?? res?.data ?? res;
        this.selectedLessonForSteps = data;
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.action-btn {
  padding: 0;
  width: 28px;
  height: 28px;
  margin-right: 6px;
}

.action-edit {
  color: #1890ff;
}

.action-delete {
  color: #ff4d4f;
}

.action-view {
  color: #52c41a;
}
</style>
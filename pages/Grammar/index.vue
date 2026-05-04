<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lí ngữ pháp</h1>
        <p class="text-sm text-gray-500 mt-1">Danh sách các bài ngữ pháp trong hệ thống</p>
      </div>
      <a-button type="primary" icon="plus" @click="openCreateModal">Thêm ngữ pháp</a-button>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <span class="text-sm text-gray-600">Lọc theo cấp độ:</span>
      <a-select
        :value="selectedLevelFilterId"
        placeholder="Tất cả cấp độ"
        style="width: 220px"
        allow-clear
        @change="handleLevelFilterChange"
      >
        <a-select-option v-for="item in levelOptions" :key="item.id" :value="item.id">
          {{ item.code }}
        </a-select-option>
      </a-select>
    </div>

    <a-card :bordered="false" class="shadow-sm">
      <a-table
        :columns="columns"
        :data-source="filteredGrammars"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        row-key="id"
      >
        

        <template slot="content" slot-scope="content">
          <span class="text-gray-700">{{ truncateText(content) }}</span>
        </template>

        <template slot="level" slot-scope="levelCode">
          <a-tag color="blue">{{ levelCode || "-" }}</a-tag>
        </template>

        <template slot="action" slot-scope="record">
          <TableActionButtons
            delete-confirm-title="Bạn có chắc muốn xóa bài ngữ pháp này?"
            @edit="openEditModal(record.id)"
            @delete="handleDelete(record.id)"
          />
        </template>
      </a-table>
    </a-card>

    <a-modal
      :title="isEditMode ? 'Chỉnh sửa ngữ pháp' : 'Thêm ngữ pháp'"
      :visible="modalVisible"
      :confirm-loading="submitLoading"
      :ok-text="isEditMode ? 'Cập nhật' : 'Tạo mới'"
      cancel-text="Hủy"
      width="760px"
      @ok="handleSubmit"
      @cancel="closeModal"
    >
      <a-form layout="vertical">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a-form-item label="Tiêu đề">
            <a-input v-model="form.title" placeholder="Nhập tiêu đề ngữ pháp" :max-length="150" />
          </a-form-item>

          <a-form-item label="Cấp độ">
            <a-select v-model="form.levelId" placeholder="Chọn cấp độ">
              <a-select-option v-for="item in levelOptions" :key="item.id" :value="item.id">
                {{ item.code }} - {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <a-form-item label="Nội dung">
          <a-textarea
            v-model="form.content"
            placeholder="Nhập nội dung ngữ pháp"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>

        <a-form-item label="Ví dụ">
          <a-textarea
            v-model="form.example"
            placeholder="Nhập ví dụ"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  createGrammar,
  deleteGrammar,
  getGrammarById,
  getListGrammar,
  updateGrammar,
} from "@/apis/grammar";
import { getListLevel } from "@/apis/levels";
import TableActionButtons from "@/components/common/TableActionButtons.vue";

export default {
  name: "GrammarPage",
  layout: "admin",
  components: {
    TableActionButtons,
  },
  data() {
    return {
      grammars: [],
      levelOptions: [],
      selectedLevelFilterId: undefined,
      loading: false,
      submitLoading: false,
      modalVisible: false,
      isEditMode: false,
      editingId: null,
      form: {
        title: "",
        content: "",
        example: "",
        levelId: undefined,
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          width: 80,
          align: "center",
        },
        {
          title: "Tiêu đề",
          dataIndex: "title",
          scopedSlots: { customRender: "title" },
          width: 230,
        },
        {
          title: "Nội dung",
          dataIndex: "content",
          scopedSlots: { customRender: "content" },
        },
        {
          title: "Cấp độ",
          dataIndex: "levelCode",
          scopedSlots: { customRender: "level" },
          width: 120,
          align: "center",
        },
        {
          title: "Thao tác",
          scopedSlots: { customRender: "action" },
          width: 120,
          align: "center",
        },
      ],
    };
  },
  computed: {
    filteredGrammars() {
      if (
        this.selectedLevelFilterId === undefined ||
        this.selectedLevelFilterId === null ||
        this.selectedLevelFilterId === ""
      ) {
        return this.grammars;
      }

      return this.grammars.filter(
        (item) => String(item.levelId) === String(this.selectedLevelFilterId)
      );
    },
  },
  async created() {
    await this.fetchLevels();
    await this.fetchGrammars();
  },
  methods: {
    extractListData(res) {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.result)) return res.result;
      return [];
    },

    extractObjectData(res) {
      if (res && typeof res === "object" && res.data && !Array.isArray(res.data)) {
        return res.data;
      }
      return res;
    },

    normalizeLevel(item) {
      return {
        id: item?.id,
        code: item?.code || "",
        name: item?.name || "",
      };
    },

    findLevelByAnyValue(value) {
      if (value === undefined || value === null || value === "") return null;

      const normalized = String(value).trim().toUpperCase();
      return (
        this.levelOptions.find((level) => level.id === value || String(level.id) === String(value)) ||
        this.levelOptions.find((level) => (level.code || "").toUpperCase() === normalized) ||
        this.levelOptions.find((level) => (level.name || "").toUpperCase() === normalized) ||
        null
      );
    },

    normalizeGrammar(item) {
      const nestedLevel = item?.level && typeof item.level === "object" ? item.level : null;
      const sourceLevelValue =
        item?.levelId ||
        item?.level_id ||
        nestedLevel?.id ||
        nestedLevel?.code ||
        nestedLevel?.name ||
        item?.level ||
        item?.levelCode;
      const matchedLevel = this.findLevelByAnyValue(sourceLevelValue);

      return {
        id: item?.id,
        title: item?.title || item?.name || item?.grammarTitle || "",
        content: item?.content || item?.description || item?.rule || "",
        example: item?.example || item?.exampleSentence || "",
        levelId: matchedLevel?.id || item?.levelId || item?.level_id || nestedLevel?.id,
        levelCode:
          matchedLevel?.code ||
          nestedLevel?.code ||
          (typeof item?.level === "string" ? item.level : ""),
      };
    },

    async fetchLevels() {
      try {
        const res = await getListLevel();
        const rawLevels = this.extractListData(res);
        this.levelOptions = rawLevels.map((item) => this.normalizeLevel(item));
      } catch (error) {
        this.$message.error("Không thể tải danh sách cấp độ!");
      }
    },

    async fetchGrammars() {
      this.loading = true;
      try {
        const res = await getListGrammar();
        const rawGrammars = this.extractListData(res);
        this.grammars = rawGrammars.map((item) => this.normalizeGrammar(item));
      } catch (error) {
        this.$message.error("Không thể tải danh sách ngữ pháp!");
      } finally {
        this.loading = false;
      }
    },

    handleLevelFilterChange(value) {
      this.selectedLevelFilterId = value;
    },

    openCreateModal() {
      this.isEditMode = false;
      this.editingId = null;
      this.form = {
        title: "",
        content: "",
        example: "",
        levelId: undefined,
      };
      this.modalVisible = true;
    },

    async openEditModal(id) {
      this.isEditMode = true;
      this.editingId = id;
      this.submitLoading = true;
      try {
        const res = await getGrammarById(id);
        const grammar = this.normalizeGrammar(this.extractObjectData(res) || {});
        this.form = {
          title: grammar.title || "",
          content: grammar.content || "",
          example: grammar.example || "",
          levelId: grammar.levelId || undefined,
        };
        this.modalVisible = true;
      } catch (error) {
        this.$message.error("Không thể tải chi tiết ngữ pháp!");
      } finally {
        this.submitLoading = false;
      }
    },

    closeModal() {
      this.modalVisible = false;
    },

    truncateText(value) {
      if (!value) return "-";
      return value.length > 100 ? `${value.slice(0, 100)}...` : value;
    },

    buildPayload() {
      return {
        title: this.form.title.trim(),
        content: this.form.content.trim(),
        example: (this.form.example || "").trim(),
        levelId: this.form.levelId,
      };
    },

    async handleSubmit() {
      if (!this.form.title || !this.form.content || !this.form.levelId) {
        this.$message.warning("Vui lòng nhập đầy đủ tiêu đề, nội dung và cấp độ.");
        return;
      }

      const payload = this.buildPayload();

      this.submitLoading = true;
      try {
        if (this.isEditMode) {
          await updateGrammar(this.editingId, payload);
          this.$message.success("Cập nhật ngữ pháp thành công!");
        } else {
          await createGrammar(payload);
          this.$message.success("Thêm ngữ pháp thành công!");
        }

        this.modalVisible = false;
        await this.fetchGrammars();
      } catch (error) {
        this.$message.error(
          this.isEditMode ? "Không thể cập nhật ngữ pháp." : "Không thể thêm ngữ pháp."
        );
      } finally {
        this.submitLoading = false;
      }
    },

    async handleDelete(id) {
      try {
        await deleteGrammar(id);
        this.$message.success("Xóa ngữ pháp thành công!");
        await this.fetchGrammars();
      } catch (error) {
        this.$message.error("Không thể xóa ngữ pháp.");
      }
    },
  },
};
</script>

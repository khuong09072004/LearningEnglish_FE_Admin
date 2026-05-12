<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lí cấp bậc</h1>
        <p class="text-sm text-gray-500 mt-1">
          Danh sách các cấp bậc trong hệ thống
        </p>
      </div>
      <a-button type="primary" icon="plus" @click="openCreateModal">
        Thêm cấp bậc
      </a-button>
    </div>

    <!-- Table -->
    <a-card :bordered="false" class="shadow-sm">
      <a-table
        :columns="columns"
        :data-source="levels"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        row-key="id"
      >
        <!-- STT -->
        <template slot="stt" slot-scope="text, record, index">
          <span class="text-gray-500">{{ index + 1 }}</span>
        </template>

        <!-- Code badge -->
        <template slot="code" slot-scope="code">
          <a-tag :color="getTagColor(code)" class="font-mono font-semibold">
            {{ code }}
          </a-tag>
        </template>

        <!-- Name -->
        <template slot="name" slot-scope="name">
          <span class="font-medium text-gray-800">{{ name }}</span>
        </template>

        <!-- Created At -->
        <template slot="created_at" slot-scope="date">
          <span class="text-gray-500 text-sm">{{ formatDate(date) }}</span>
        </template>

        <!-- Actions -->
        <template slot="action" slot-scope="record">
          <TableActionButtons
            delete-confirm-title="Bạn có chắc muốn xóa cấp bậc này?"
            @edit="openEditModal(record.id)"
            @delete="handleDelete(record.id)"
          />
        </template>
      </a-table>
    </a-card>

    <a-modal
      :title="isEditMode ? 'Chỉnh sửa cấp bậc' : 'Thêm cấp bậc'"
      :visible="modalVisible"
      :confirm-loading="submitLoading"
      :ok-text="isEditMode ? 'Cập nhật' : 'Tạo mới'"
      cancel-text="Hủy"
      @ok="handleSubmit"
      @cancel="closeModal"
    >
      <a-form layout="vertical">
        <a-form-item label="Mã cấp bậc">
          <a-input
            v-model="form.code"
            placeholder="Ví dụ: A1, B2, BEGINNER"
            :max-length="30"
          />
        </a-form-item>

        <a-form-item label="Tên cấp bậc">
          <a-input
            v-model="form.name"
            placeholder="Nhập tên cấp bậc"
            :max-length="100"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  createLevel,
  deleteLevel,
  getLevelById,
  getListLevel,
  updateLevel,
} from "@/apis/levels";
import TableActionButtons from "@/components/common/TableActionButtons.vue";

export default {
  name: "LevelsPage",
  layout: "admin",
  components: {
    TableActionButtons,
  },
  data() {
    return {
      levels: [],
      loading: false,
      submitLoading: false,
      modalVisible: false,
      isEditMode: false,
      editingId: null,
      form: {
        code: "",
        name: "",
      },
      columns: [
        {
          title: "STT",
          scopedSlots: { customRender: "stt" },
          width: 70,
          align: "center",
        },
        {
          title: "Mã cấp bậc",
          dataIndex: "code",
          scopedSlots: { customRender: "code" },
          width: 140,
        },
        {
          title: "Tên cấp bậc",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Ngày tạo",
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          width: 180,
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
  async created() {
    await this.fetchLevels();
  },
  methods: {
    async fetchLevels() {
      this.loading = true;
      try {
        const res = await getListLevel();
        const rawLevels = this.extractListData(res);
        this.levels = rawLevels.map((item) => this.normalizeLevel(item));
      } catch (error) {
        this.$message.error("Không thể tải danh sách cấp bậc!");
      } finally {
        this.loading = false;
      }
    },

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
        ...item,
        created_at:
          item?.created_at || item?.createdAt || item?.createdDate || item?.created_time,
      };
    },

    openCreateModal() {
      this.isEditMode = false;
      this.editingId = null;
      this.form = {
        code: "",
        name: "",
      };
      this.modalVisible = true;
    },

    async openEditModal(id) {
      this.isEditMode = true;
      this.editingId = id;
      this.submitLoading = true;
      try {
        const res = await getLevelById(id);
        const level = this.normalizeLevel(this.extractObjectData(res) || {});
        this.form = {
          code: level.code || "",
          name: level.name || "",
        };
        this.modalVisible = true;
      } catch (error) {
        this.$message.error("Không thể tải chi tiết cấp bậc!");
      } finally {
        this.submitLoading = false;
      }
    },

    closeModal() {
      this.modalVisible = false;
    },

    async handleSubmit() {
      if (!this.form.code || !this.form.name) {
        this.$message.warning("Vui lòng nhập đầy đủ mã và tên cấp bậc.");
        return;
      }

      const payload = {
        code: this.form.code.trim(),
        name: this.form.name.trim(),
      };

      this.submitLoading = true;
      try {
        if (this.isEditMode) {
          await updateLevel(this.editingId, payload);
          this.$message.success("Cập nhật cấp bậc thành công!");
        } else {
          await createLevel(payload);
          this.$message.success("Thêm cấp bậc thành công!");
        }

        this.modalVisible = false;
        await this.fetchLevels();
      } catch (error) {
        this.$message.error(
          this.isEditMode
            ? "Không thể cập nhật cấp bậc."
            : "Không thể thêm cấp bậc."
        );
      } finally {
        this.submitLoading = false;
      }
    },

    getTagColor(code) {
      const colorMap = {
        BEGINNER: "orange",
        A1: "green",
        A2: "cyan",
        B1: "blue",
        B2: "geekblue",
        C1: "purple",
        C2: "magenta",
      };
      return colorMap[code] || "black";
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    async handleDelete(id) {
      try {
        await deleteLevel(id);
        this.$message.success("Xóa cấp bậc thành công!");
        await this.fetchLevels();
      } catch (error) {
        this.$message.error("Không thể xóa cấp bậc.");
      }
    },
  },
};
</script>
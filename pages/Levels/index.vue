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
      <a-button type="primary" icon="plus"> Thêm cấp bậc </a-button>
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
          <a-space>
            <a-tooltip title="Chỉnh sửa">
              <a-button type="link" icon="edit" class="text-blue-500 p-0" />
            </a-tooltip>
            <a-tooltip title="Xóa">
              <a-popconfirm
                title="Bạn có chắc muốn xóa cấp bậc này?"
                ok-text="Xóa"
                cancel-text="Hủy"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" icon="delete" class="text-red-500 p-0" />
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getListLevel } from "@/apis/levels";

export default {
  name: "LevelsPage",
  layout: "admin",
  data() {
    return {
      levels: [],
      loading: false,
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
        this.levels = res.data;
      } catch (error) {
        this.$message.error("Không thể tải danh sách cấp bậc!");
      } finally {
        this.loading = false;
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
      return colorMap[code] || "default";
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

    handleDelete(id) {
      // Gọi API xóa ở đây
      this.$message.success(`Đã xóa cấp bậc #${id}`);
    },
  },
};
</script>
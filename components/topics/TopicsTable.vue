<template>
  <a-card :bordered="false" class="shadow-sm">
    <a-table
      :columns="columns"
      :data-source="topics"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      row-key="id"
    >
      <template slot="level" slot-scope="levelCode, record">
        <a-tag
          :style="getLevelTagStyle(record.levelCode)"
          class="font-mono font-semibold border-0"
        >
          {{ levelCode || "-" }}
        </a-tag>
      </template>

      <template slot="name" slot-scope="name">
        <span class="font-medium text-gray-800">{{ name }}</span>
      </template>

      <template slot="action" slot-scope="record">
        <TableActionButtons
          delete-confirm-title="Bạn có chắc muốn xóa chủ đề này?"
          @edit="$emit('edit', record.id)"
          @delete="$emit('delete', record.id)"
        />
      </template>
    </a-table>
  </a-card>
</template>

<script>
import TableActionButtons from "@/components/common/TableActionButtons.vue";

export default {
  name: "TopicsTable",
  components: {
    TableActionButtons,
  },
  props: {
    topics: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          width: 90,
          align: "center",
        },
        {
          title: "Tên chủ đề",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Cấp độ",
          dataIndex: "levelCode",
          scopedSlots: { customRender: "level" },
          width: 160,
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
  methods: {
    getLevelTagStyle(level) {
      const colorMap = {
        BEGINNER: { backgroundColor: "#0EA5E9", color: "#FFFFFF" },
        A1: { backgroundColor: "#22C55E", color: "#FFFFFF" },
        A2: { backgroundColor: "#14B8A6", color: "#FFFFFF" },
        B1: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
        B2: { backgroundColor: "#6366F1", color: "#FFFFFF" },
        C1: { backgroundColor: "#A855F7", color: "#FFFFFF" },
        C2: { backgroundColor: "#EC4899", color: "#FFFFFF" },
      };

      return colorMap[level] || { backgroundColor: "#64748B", color: "#FFFFFF" };
    },
  },
};
</script>

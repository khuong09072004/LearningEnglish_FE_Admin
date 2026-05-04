<template>
  <a-card :bordered="false" class="shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Exercise</h2>
        <p class="text-xs text-gray-500 mt-1">Danh sach bai tap trong he thong</p>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="exercises"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      row-key="id"
    >
      <template slot="title" slot-scope="{ text, record }">
        <div class="flex flex-col">
          <span class="font-medium text-gray-900">{{ text || (record && record.name) || '-' }}</span>
          <span class="text-xs text-gray-500" v-if="record && record.type">{{ record.type }}</span>
        </div>
      </template>

      <template slot="description" slot-scope="{ text }">
        <span class="text-gray-700">{{ text || '-' }}</span>
      </template>

      <template slot="topic" slot-scope="{ text, record }">
        <a-tag color="blue">{{ text || (record && record.topicId) || '-' }}</a-tag>
      </template>

      <template slot="action" slot-scope="{ record }">
        <div class="flex items-center justify-center gap-3">
          <a-tooltip title="Xem exercise-item">
            <a-button type="link" icon="eye" class="p-0 text-green-600" @click="$emit('view-items', record)" />
          </a-tooltip>
          <a-tooltip title="Sua">
            <a-button type="link" icon="edit" class="p-0 text-blue-500" @click="$emit('edit', record && record.id)" />
          </a-tooltip>
          <a-tooltip title="Xoa">
            <a-popconfirm
              title="Ban co chac muon xoa bai tap nay?"
              ok-text="Xoa"
              cancel-text="Huy"
              @confirm="$emit('delete', record && record.id)"
            >
              <a-button type="link" icon="delete" class="p-0 text-red-500" />
            </a-popconfirm>
          </a-tooltip>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  name: "ExercisesTable",
  props: {
    exercises: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    columns() {
      return [
        { title: "ID", dataIndex: "id", width: 80, align: "center" },
        { title: "Tieu de", dataIndex: "title", scopedSlots: { customRender: "title" } },
        { title: "Mo ta", dataIndex: "description", scopedSlots: { customRender: "description" } },
        { title: "Topic", dataIndex: "topicName", scopedSlots: { customRender: "topic" }, width: 120, align: "center" },
        { title: "Thao tac", scopedSlots: { customRender: "action" }, width: 170, align: "center" },
      ];
    },
  },
};
</script>

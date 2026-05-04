<template>
  <a-card :bordered="false" class="shadow-sm">
    <a-table
      :dataSource="lessons"
      :columns="columns"
      :rowKey="rowKey"
      :loading="lessonsLoading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
    >
      <template slot="levelName" slot-scope="text">
        <a-tag color="green">{{ text || '-' }}</a-tag>
      </template>

      <template slot="skillFocus" slot-scope="text">
        <a-tag color="blue">{{ text || '-' }}</a-tag>
      </template>

      <template slot="stepsCount" slot-scope="text, record">
        <span class="font-medium text-gray-700">{{ record.steps ? record.steps.length : 0 }}</span>
      </template>

      <template slot="action" slot-scope="text, record">
        <a-tooltip title="Sửa">
          <a-button size="small" type="link" icon="edit" @click="$emit('edit', record)" class="action-btn action-edit" />
        </a-tooltip>
        <a-tooltip title="Xóa">
          <a-button size="small" type="link" icon="delete" @click="$emit('delete', record)" class="action-btn action-delete" />
        </a-tooltip>
        <a-tooltip title="Xem steps">
          <a-button size="small" type="link" icon="eye" @click="$emit('view-steps', record)" class="action-btn action-view" />
        </a-tooltip>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  name: "LessonTable",
  props: {
    lessons: { type: Array, default: () => [] },
    lessonsLoading: { type: Boolean, default: false },
    rowKey: { type: [String, Function], default: 'id' },
  },
  computed: {
    columns() {
      return [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
        { title: 'Level', dataIndex: 'levelName', key: 'levelName', scopedSlots: { customRender: 'levelName' }, width: 110 },
        { title: 'Skill', dataIndex: 'skillFocus', key: 'skillFocus', scopedSlots: { customRender: 'skillFocus' }, width: 110 },
        { title: 'Số steps', key: 'stepsCount', scopedSlots: { customRender: 'stepsCount' }, width: 90 },
        { title: 'Hành động', key: 'action', scopedSlots: { customRender: 'action' }, width: 200 },
      ];
    },
  },
};
</script>

<style scoped>
.action-btn { padding: 0; width: 28px; height: 28px; margin-right: 6px; }
.action-edit { color: #1890ff; }
.action-delete { color: #ff4d4f; }
.action-view { color: #52c41a; }
</style>

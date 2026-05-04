<template>
  <a-card :bordered="false" class="shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Exercise Item</h2>
        <p class="text-xs text-gray-500 mt-1">
          {{ selectedExercise ? `Dang xem bai tap #${selectedExercise.id}` : 'Chon mot exercise de xem item' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <a-button @click="$emit('refresh-items')" :loading="loading" :disabled="!selectedExercise">Lam moi item</a-button>
      </div>
    </div>

    <div v-if="selectedExercise" class="mb-4 rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700">
      <span class="font-medium">{{ exerciseDisplayTitle(selectedExercise) }}</span>
      <span class="mx-2 text-gray-400">|</span>
      <span>ID: {{ selectedExercise.id }}</span>
      <span v-if="selectedExercise.topicId" class="mx-2 text-gray-400">|</span>
      <span v-if="selectedExercise.topicId">Topic: {{ selectedExercise.topicId }}</span>
    </div>

    <a-empty v-if="!selectedExercise" description="Hay chon mot bai tap de xem exercise-item" />

    <a-table
      v-else
      :columns="columns"
      :data-source="items"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      row-key="id"
    >
      <template slot="summary" slot-scope="{ record }">
        <div class="space-y-1">
          <div class="font-medium text-gray-900">{{ itemDisplayTitle(record) }}</div>
          <div class="text-xs text-gray-500 break-all">{{ itemDisplaySummary(record) }}</div>
        </div>
      </template>

      <template slot="raw" slot-scope="{ record }">
        <pre class="max-w-[420px] whitespace-pre-wrap break-words text-xs text-gray-600">{{ stringifyJson(record.raw || record) }}</pre>
      </template>

      <template slot="action" slot-scope="{ record }">
        <div class="flex items-center justify-center gap-3">
          <a-tooltip title="Sua">
            <a-button type="link" icon="edit" class="p-0 text-blue-500" @click="$emit('edit-item', record && record.id)" />
          </a-tooltip>
          <a-tooltip title="Xoa">
            <a-popconfirm
              title="Ban co chac muon xoa item nay?"
              ok-text="Xoa"
              cancel-text="Huy"
              @confirm="$emit('delete-item', record && record.id)"
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
  name: "ExerciseItemsPane",
  props: {
    selectedExercise: {
      type: Object,
      default: null,
    },
    items: {
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
        { title: "Tom tat", dataIndex: "summary", scopedSlots: { customRender: "summary" } },
        { title: "Du lieu tho", dataIndex: "raw", scopedSlots: { customRender: "raw" }, width: 420 },
        { title: "Thao tac", scopedSlots: { customRender: "action" }, width: 120, align: "center" },
      ];
    },
  },
  methods: {
    stringifyJson(value) {
      try {
        return JSON.stringify(value, null, 2);
      } catch (error) {
        return "{}";
      }
    },
    exerciseDisplayTitle(exercise) {
      return exercise?.title || exercise?.name || exercise?.exerciseName || `Exercise #${exercise?.id || '-'}`;
    },
    itemDisplayTitle(item) {
      return item?.title || item?.name || item?.question || item?.content || item?.type || `Item #${item?.id || '-'}`;
    },
    itemDisplaySummary(item) {
      return item?.description || item?.answer || item?.correctAnswer || item?.expectedAnswer || item?.content || item?.question || '-';
    },
  },
};
</script>

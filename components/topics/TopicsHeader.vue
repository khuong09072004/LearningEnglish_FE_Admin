<template>
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lí chủ đề</h1>
        <p class="text-sm text-gray-500 mt-1">Danh sách các chủ đề trong hệ thống</p>
      </div>
      <a-button type="primary" icon="plus" @click="$emit('create')">
        Thêm chủ đề
      </a-button>
    </div>

    <div class="mt-4 flex items-center gap-3">
      <span class="text-sm text-gray-600">Lọc theo cấp độ:</span>
      <a-select
        :value="selectedLevelId"
        :loading="loading"
        placeholder="Tất cả cấp độ"
        style="width: 220px"
        allow-clear
        @change="$emit('change-level-filter', $event)"
      >
        <a-select-option v-for="item in levelOptions" :key="item.id" :value="item.id">
          {{ item.code || item.name }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopicsHeader",
  props: {
    levelOptions: {
      type: Array,
      default: () => [],
    },
    selectedLevelId: {
      type: [Number, String, null],
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

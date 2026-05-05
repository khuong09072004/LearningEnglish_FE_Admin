<template>
  <a-card :bordered="false" class="shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Exercise</h2>
        <p class="text-xs text-gray-500 mt-1">Danh sach bai tap trong he thong</p>
      </div>
    </div>

    <!-- Bo loc -->
    <div class="flex items-center gap-4 mb-4">
      <a-select
        v-model="filterTopicId"
        placeholder="Loc theo Topic"
        style="width: 180px"
        allowClear
      >
          <a-select-option v-for="t in topicOptions" :key="t.id" :value="t.id">
            {{ t.name || ('Topic ' + t.id) }}
          </a-select-option>
      </a-select>

      <a-select
        v-model="filterType"
        placeholder="Loc theo Type"
        style="width: 220px"
        allowClear
      >
        <a-select-option v-for="type in typeOptions" :key="type" :value="type">
          {{ type }}
        </a-select-option>
      </a-select>

      <a-select
        v-model="filterCategory"
        placeholder="Loc theo Category"
        style="width: 220px"
        allowClear
      >
        <a-select-option v-for="c in categoryOptions" :key="c" :value="c">
          {{ c }}
        </a-select-option>
      </a-select>

      <a-button @click="resetFilters">Reset</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredExercises"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      row-key="id"
    >
      <template slot="topic" slot-scope="text, record">
        <a-tag color="blue">{{ getTopicName(record.topicId, record) || '-' }}</a-tag>
      </template>
      

      <template slot="category" slot-scope="text">
        <a-tag :color="categoryColor(text)">{{ text || '-' }}</a-tag>
      </template>

      <template slot="duration" slot-scope="text">
        <span>{{ text ? text + ' phút' : '-' }}</span>
      </template>

      <template slot="action" slot-scope="text, record">
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
import { getListTopic } from "@/apis/topics";

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
  data() {
    return {
      filterTopicId: undefined,
      filterType: undefined,
      filterCategory: undefined,
      topics: [],
    };
  },
  computed: {
    topicIdOptions() {
      return this.topics.map((t) => t.id || t._id).filter(Boolean);
    },

    topicOptions() {
      if (this.topics && this.topics.length) return this.topics;
      const ids = this.exercises.map((e) => e.topicId).filter(Boolean);
      const uniq = [...new Set(ids)].sort((a, b) => a - b);
      return uniq.map((id) => ({ id, name: `Topic ${id}` }));
    },

    typeOptions() {
      const types = this.exercises.map((e) => e.type).filter(Boolean);
      return [...new Set(types)].sort();
    },

    categoryOptions() {
      const cats = this.exercises.map((e) => e.category).filter(Boolean);
      return [...new Set(cats)].sort();
    },

    filteredExercises() {
      return this.exercises.filter((e) => {
        const matchTopic = this.filterTopicId == null || e.topicId == this.filterTopicId;
        const matchType = this.filterType == null || e.type === this.filterType;
        const matchCategory = this.filterCategory == null || e.category === this.filterCategory;
        return matchTopic && matchType && matchCategory;
      });
    },

    columns() {
      return [
        { title: "ID", dataIndex: "id", width: 60, align: "center" },
        { title: "Tieu de", dataIndex: "title", scopedSlots: { customRender: "title" } },
        { title: "Topic", dataIndex: "topicId", scopedSlots: { customRender: "topic" }, width: 160, align: "center" },
        { title: "Category", dataIndex: "category", scopedSlots: { customRender: "category" }, width: 120, align: "center" },
        { title: "Thoi luong", dataIndex: "duration", scopedSlots: { customRender: "duration" }, width: 110, align: "center" },
        { title: "Thao tac", scopedSlots: { customRender: "action" }, width: 170, align: "center" },
      ];
    },
  },
  methods: {
    async fetchTopics() {
      try {
        const res = await getListTopic();
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.data)) list = res.data;
        else list = [];
        this.topics = list.map((t) => ({ id: t.id || t._id || t.topicId, name: t.name || t.title || t.topicName || "" }));
      } catch (e) {
        // ignore
      }
    },
    resetFilters() {
      this.filterTopicId = undefined;
      this.filterType = undefined;
      this.filterCategory = undefined;
    },

    getTopicName(topicId, record) {
      if (record && record.topicName) return record.topicName;
      const t = this.topics.find((x) => x.id == topicId || x.id == (record && record.topicId));
      if (t) return t.name || t.title || `Topic ${topicId}`;
      return topicId ? `Topic ${topicId}` : "";
    },

    categoryColor(category) {
      const map = {
        VOCAB: "purple",
        GRAMMAR: "blue",
        READING: "green",
        LISTENING: "orange",
        WRITING: "red",
      };
      return map[category] || "default";
    },
  },
  created() {
    this.fetchTopics();
  },
};
</script>
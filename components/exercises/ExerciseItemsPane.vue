<template>
  <a-card :bordered="false" class="shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Exercise Item</h2>
        <p class="text-xs text-gray-500 mt-1">
          {{ selectedExercise ? `Đang xem: ${exerciseDisplayTitle(selectedExercise)}` : 'Chọn một exercise để xem item' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <a-button type="primary"  :disabled="!selectedExercise" @click="openCreateModal">
          Thêm Exercise Item
        </a-button>
      </div>
    </div>

    <!-- Exercise info bar -->
    <div v-if="selectedExercise" class="mb-4 rounded-lg border bg-blue-50 px-4 py-3 text-sm text-gray-700 flex flex-wrap gap-4 items-center">
      <span><span class="text-gray-400">ID:</span> <b>{{ selectedExercise.id }}</b></span>
      <span><span class="text-gray-400">Tên:</span> <b>{{ exerciseDisplayTitle(selectedExercise) }}</b></span>
      <span v-if="selectedExercise.topicName || selectedExercise.topicId">
        <span class="text-gray-400">Topic:</span> <b>{{ selectedExercise.topicName || selectedExercise.topicId }}</b>
      </span>
      <span v-if="selectedExercise.type">
        <a-tag :color="typeColor(selectedExercise.type)">{{ selectedExercise.type }}</a-tag>
      </span>
      <span class="ml-auto text-gray-400 text-xs">{{ items.length }} câu hỏi</span>
    </div>

    <a-empty v-if="!selectedExercise" description="Hãy chọn một bài tập để xem exercise-item" />

    <a-table
      v-else
      :columns="columns"
      :data-source="items"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: true }"
      row-key="id"
    >
      <!-- STT -->
      <template slot="position" slot-scope="text, record">
        <a-tag color="blue">{{ record.position || '-' }}</a-tag>
      </template>

      <!-- Câu hỏi -->
      <template slot="question" slot-scope="text, record">
        <div class="py-1">

          <!-- VOCAB_MATCH: left + right_options -->
          <template v-if="record.question && record.question.left && record.question.right_options">
            <div class="text-xs text-gray-400 mb-1">Phiên âm → Từ</div>
            <div class="font-mono font-semibold text-purple-700 text-base mb-2">{{ record.question.left }}</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(opt, i) in record.question.right_options" :key="i"
                :color="opt === getCorrectAnswer(record) ? 'green' : 'green'">
                {{ opt }}
              </a-tag>
            </div>
          </template>

          <!-- VOCAB_MEANING_CHOICE: word + options -->
          <template v-else-if="record.question && record.question.word && record.question.options">
            <div class="text-xs text-gray-400 mb-1">Chọn nghĩa của từ</div>
            <div class="font-bold text-blue-700 text-base mb-2">{{ record.question.word }}</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(opt, i) in record.question.options" :key="i"
                :color="opt === getCorrectAnswer(record) ? 'green' : 'green'">
                {{ opt }}
              </a-tag>
            </div>
          </template>

          <!-- VOCAB_PHONETIC: phonetic -->
          <template v-else-if="record.question && record.question.phonetic">
            <div class="text-xs text-gray-400 mb-1">Phiên âm → Từ</div>
            <div class="font-mono font-semibold text-purple-700 text-xl">{{ record.question.phonetic }}</div>
          </template>

          <!-- VOCAB_PATTERN_FILL: pattern + sentence -->
          <template v-else-if="record.question && record.question.pattern">
            <div class="text-xs text-gray-400 mb-1">Điền từ theo gợi ý</div>
            <div class="font-mono text-orange-600 font-bold mb-2">{{ record.question.pattern }}</div>
            <div class="text-gray-700 text-sm italic">{{ record.question.sentence }}</div>
          </template>

          <!-- GRAMMAR_FIND_ERROR: parts + sentence -->
          <template v-else-if="record.question && record.question.parts">
            <div class="text-xs text-gray-400 mb-1">Tìm lỗi sai</div>
            <div class="text-gray-700 text-sm italic mb-2">{{ record.question.sentence }}</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(val, key) in record.question.parts" :key="key"
                :color="isErrorPart(key, record) ? 'red' : 'green'">
                <b>({{ key.toUpperCase() }})</b> {{ val }}
              </a-tag>
            </div>
          </template>

          <!-- GRAMMAR_SENTENCE_CHOICE: sentences -->
          <template v-else-if="record.question && record.question.sentences">
            <div class="text-xs text-gray-400 mb-1">Chọn câu đúng</div>
            <div class="space-y-1">
              <div v-for="(s, i) in record.question.sentences" :key="i"
                class="flex items-start gap-2 text-sm"
                :class="s === getCorrectAnswer(record) ? 'text-green-700 font-medium' : 'text-gray-500'">
                <a-icon :type="s === getCorrectAnswer(record) ? 'check-circle' : 'close-circle'"
                  :theme="s === getCorrectAnswer(record) ? 'filled' : 'outlined'"
                  :class="s === getCorrectAnswer(record) ? 'text-green-500' : 'text-gray-300'" class="mt-0.5" />
                {{ s }}
              </div>
            </div>
          </template>

          <!-- GRAMMAR_REORDER / WRITE_REORDER: scrambled -->
          <template v-else-if="record.question && record.question.scrambled">
            <div class="text-xs text-gray-400 mb-1">Sắp xếp từ thành câu</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(word, i) in record.question.scrambled" :key="i" color="geekblue">{{ word }}</a-tag>
            </div>
          </template>

          <!-- WRITE_REORDER: words -->
          <template v-else-if="record.question && record.question.words">
            <div class="text-xs text-gray-400 mb-1">Sắp xếp từ thành câu</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(word, i) in record.question.words" :key="i" color="geekblue">{{ word }}</a-tag>
            </div>
          </template>

          <!-- WRITE_REORDER_GROUP: groups -->
          <template v-else-if="record.question && record.question.groups">
            <div class="text-xs text-gray-400 mb-1">Sắp xếp nhóm từ thành câu</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(group, i) in record.question.groups" :key="i" color="geekblue">{{ group }}</a-tag>
            </div>
          </template>

          <!-- GRAMMAR_REWRITE / WRITE_REWRITE: original + instruction -->
          <template v-else-if="record.question && record.question.original">
            <div class="text-xs text-gray-400 mb-1">Viết lại câu</div>
            <div class="text-red-500 line-through text-sm mb-1">{{ record.question.original }}</div>
            <div class="text-gray-400 text-xs italic">{{ record.question.instruction }}</div>
          </template>

          <!-- READ_MCQ: question + options + passage_id -->
          <template v-else-if="record.question && record.question.question && record.question.options && record.question.passage_id">
            <div class="text-xs text-gray-400 mb-1">
              Đọc hiểu - Trắc nghiệm
              <a-tag color="cyan" class="ml-1">Passage #{{ record.question.passage_id }}</a-tag>
            </div>
            <div class="text-gray-800 font-medium mb-2">{{ record.question.question }}</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(opt, i) in record.question.options" :key="i"
                :color="opt === getCorrectAnswer(record) ? 'green' : 'green'">
                {{ opt }}
              </a-tag>
            </div>
          </template>

          <!-- READ_QA: question + passage_id (không có options) -->
          <template v-else-if="record.question && record.question.question && record.question.passage_id">
            <div class="text-xs text-gray-400 mb-1">
              Đọc hiểu - Tự luận
              <a-tag color="cyan" class="ml-1">Passage #{{ record.question.passage_id }}</a-tag>
            </div>
            <div class="text-gray-800 font-medium">{{ record.question.question }}</div>
          </template>

          <!-- GRAMMAR_MCQ: question + options (không có passage_id) -->
          <template v-else-if="record.question && record.question.question && record.question.options">
            <div class="text-xs text-gray-400 mb-1">Trắc nghiệm</div>
            <div class="text-gray-800 font-medium mb-2">{{ record.question.question }}</div>
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(opt, i) in record.question.options" :key="i"
                :color="opt === getCorrectAnswer(record) ? 'green' : 'green'">
                {{ opt }}
              </a-tag>
            </div>
          </template>

          <!-- READ_FILL / LISTEN_QA: question (không có options, không có passage_id) -->
          <template v-else-if="record.question && record.question.question">
            <div class="text-xs text-gray-400 mb-1">Điền / Tự luận</div>
            <div class="text-gray-800" v-html="highlightBlank(record.question.question)"></div>
          </template>

          <!-- LISTEN_FILL / WRITE_FIX: sentence -->
          <template v-else-if="record.question && record.question.sentence">
            <div class="text-xs text-gray-400 mb-1">Nghe & điền / Sửa lỗi</div>
            <div class="text-gray-800" v-html="highlightBlank(record.question.sentence)"></div>
          </template>

          <!-- Fallback -->
          <template v-else>
            <pre class="text-xs text-gray-400 whitespace-pre-wrap">{{ stringifyJson(record.question) }}</pre>
          </template>

        </div>
      </template>

      <!-- Đáp án -->
      <template slot="answer" slot-scope="text, record">
        <div class="py-1">
          <!-- answers là array (LISTEN_QA, READ_FILL, LISTEN_FILL) -->
          <template v-if="Array.isArray(getAnswerRaw(record))">
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="(ans, i) in getAnswerRaw(record)" :key="i" color="green">
                <a-icon type="check" /> {{ ans }}
              </a-tag>
            </div>
            <div v-if="getAnswerRaw(record).length > 1" class="text-xs text-gray-400 mt-1">
              {{ getAnswerRaw(record).length }} đáp án chấp nhận
            </div>
          </template>
          <!-- answer là string -->
          <template v-else-if="getCorrectAnswer(record)">
            <div class="flex items-center gap-1">
              <a-icon type="check-circle" theme="filled" class="text-green-500" />
              <span class="text-green-700 font-medium">{{ getCorrectAnswer(record) }}</span>
            </div>
          </template>
          <span v-else class="text-gray-300 text-xs">—</span>
        </div>
      </template>

      <!-- Thao tác -->
      <template slot="action" slot-scope="text, record">
        <div class="flex items-center justify-center gap-2">
          <a-tooltip title="Sửa">
            <a-button type="link" icon="edit" class="p-0 text-blue-500" @click="openEditModal(record)" />
          </a-tooltip>
          <a-tooltip title="Xóa">
            <a-popconfirm
              title="Bạn có chắc muốn xóa item này?"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="$emit('delete-item', record.id)"
            >
              <a-button type="link" icon="delete" class="p-0 text-red-500" />
            </a-popconfirm>
          </a-tooltip>
        </div>
      </template>
    </a-table>

    <ItemModal
      :visible="itemModalVisible"
      :selected-exercise="selectedExercise"
      :initial-values="editingItem"
      @success="$emit('refresh-items')"
      @close="itemModalVisible = false"
    />
  </a-card>
</template>

<script>
import ItemModal from "@/components/exercises/ItemModal";

export default {
  name: "ExerciseItemsPane",
  components: { ItemModal },
  props: {
    selectedExercise: { type: Object, default: null },
    items: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      itemModalVisible: false,
      editingItem: null,
    };
  },
  computed: {
    columns() {
      return [
        { title: "STT", dataIndex: "position", scopedSlots: { customRender: "position" }, width: 65, align: "center" },
        { title: "ID", dataIndex: "id", width: 65, align: "center" },
        { title: "Câu hỏi", dataIndex: "question", scopedSlots: { customRender: "question" } },
        { title: "Đáp án đúng", dataIndex: "answer", scopedSlots: { customRender: "answer" }, width: 220 },
        { title: "Thao tác", scopedSlots: { customRender: "action" }, width: 90, align: "center" },
      ];
    },
  },
  methods: {
    // Lấy đáp án string đơn
    getCorrectAnswer(item) {
      const a = item?.answer;
      if (!a) return null;
      if (typeof a.answer === 'string') return a.answer;
      if (typeof a === 'string') return a;
      return null;
    },

    // Lấy raw answer - có thể là string hoặc array
    getAnswerRaw(item) {
      const a = item?.answer;
      if (!a) return null;
      if (Array.isArray(a.answers)) return a.answers;
      if (typeof a.answer === 'string') return null; // để getCorrectAnswer xử lý
      return null;
    },

    // GRAMMAR_FIND_ERROR: answer "a-has" => key "a" là lỗi
    isErrorPart(key, item) {
      const ans = this.getCorrectAnswer(item);
      if (!ans) return false;
      const errorKey = ans.split('-')[0]?.toLowerCase();
      return key.toLowerCase() === errorKey;
    },

    // Highlight ___ thành gạch chân xanh
    highlightBlank(text) {
      if (!text) return '';
      return text.replace(/_{2,}/g,
        '<span style="display:inline-block;min-width:80px;border-bottom:2px solid #1890ff;margin:0 4px;vertical-align:bottom;">&nbsp;</span>'
      );
    },

    openCreateModal() {
      this.editingItem = null;
      this.itemModalVisible = true;
    },
    openEditModal(record) {
      this.editingItem = record;
      this.itemModalVisible = true;
    },
    stringifyJson(value) {
      try { return JSON.stringify(value, null, 2); } catch { return '{}'; }
    },

    exerciseDisplayTitle(exercise) {
      return exercise?.title || exercise?.name || exercise?.exerciseName || `Exercise #${exercise?.id || '-'}`;
    },

    // Màu tag theo nhóm
    typeColor(type) {
      if (!type) return 'default';
      if (type.startsWith('VOCAB'))   return 'purple';
      if (type.startsWith('GRAMMAR')) return 'blue';
      if (type.startsWith('READ'))    return 'cyan';
      if (type.startsWith('LISTEN'))  return 'orange';
      if (type.startsWith('WRITE'))   return 'green';
      return 'default';
    },
  },
};
</script>
<template>
  <a-modal
    :visible="visible"
    :title="isEdit ? `Sửa Exercise Item #${initialValues && initialValues.id}` : 'Thêm Exercise Item'"
    width="680px"
    :confirm-loading="submitLoading"
    ok-text="Lưu"
    cancel-text="Hủy"
    @ok="handleSubmit"
    @cancel="$emit('close')"
  >
    <a-form :form="form" layout="vertical">

      <!-- Position -->
      <a-form-item label="Vị trí (position)">
        <a-input-number
          v-decorator="['position', { rules: [{ required: true, message: 'Nhập vị trí' }] }]"
          :min="1"
          style="width: 120px"
        />
      </a-form-item>

      <!-- ============ VOCAB_MATCH ============ -->
      <template v-if="exerciseType === 'VOCAB_MATCH'">
        <a-form-item label="Phiên âm (left)">
          <a-input
            v-decorator="['question_left', { rules: [{ required: true, message: 'Nhập phiên âm' }] }]"
            placeholder="/kætʃ ʌp wɪð/"
          />
        </a-form-item>
        <a-form-item label="Các lựa chọn (right_options)">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_right_options_${i}`, { rules: [{ required: true, message: 'Nhập lựa chọn' }] }]"
              :placeholder="`Lựa chọn ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm lựa chọn</a-button>
        </a-form-item>
        <a-form-item label="Đáp án đúng">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="Catch up with"
          />
        </a-form-item>
      </template>

      <!-- ============ VOCAB_MEANING_CHOICE ============ -->
      <template v-else-if="exerciseType === 'VOCAB_MEANING_CHOICE'">
        <a-form-item label="Từ vựng (word)">
          <a-input
            v-decorator="['question_word', { rules: [{ required: true, message: 'Nhập từ vựng' }] }]"
            placeholder="Blockchain"
          />
        </a-form-item>
        <a-form-item label="Các lựa chọn (options)">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_options_${i}`, { rules: [{ required: true, message: 'Nhập lựa chọn' }] }]"
              :placeholder="`Lựa chọn ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm lựa chọn</a-button>
        </a-form-item>
        <a-form-item label="Đáp án đúng">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="Chuỗi khối"
          />
        </a-form-item>
      </template>

      <!-- ============ VOCAB_PHONETIC ============ -->
      <template v-else-if="exerciseType === 'VOCAB_PHONETIC'">
        <a-form-item label="Phiên âm (phonetic)">
          <a-input
            v-decorator="['question_phonetic', { rules: [{ required: true, message: 'Nhập phiên âm' }] }]"
            placeholder="/ˈkæt/"
          />
        </a-form-item>
        <a-form-item label="Đáp án (từ đúng)">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="cat"
          />
        </a-form-item>
      </template>

      <!-- ============ VOCAB_PATTERN_FILL ============ -->
      <template v-else-if="exerciseType === 'VOCAB_PATTERN_FILL'">
        <a-form-item label="Pattern gợi ý">
          <a-input
            v-decorator="['question_pattern', { rules: [{ required: true, message: 'Nhập pattern' }] }]"
            placeholder="i______"
          />
        </a-form-item>
        <a-form-item label="Câu gợi ý (sentence)">
          <a-textarea
            v-decorator="['question_sentence', { rules: [{ required: true, message: 'Nhập câu' }] }]"
            placeholder="A robot is ... designed to i_ _ _ _ _ _ actions of humans."
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="Đáp án">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="imitate"
          />
        </a-form-item>
      </template>

      <!-- ============ GRAMMAR_MCQ ============ -->
      <template v-else-if="exerciseType === 'GRAMMAR_MCQ'">
        <a-form-item label="Câu hỏi">
          <a-input
            v-decorator="['question_question', { rules: [{ required: true, message: 'Nhập câu hỏi' }] }]"
            placeholder="She ……….. every day."
          />
        </a-form-item>
        <a-form-item label="Các lựa chọn (options)">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_options_${i}`, { rules: [{ required: true, message: 'Nhập lựa chọn' }] }]"
              :placeholder="`Lựa chọn ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm lựa chọn</a-button>
        </a-form-item>
        <a-form-item label="Đáp án đúng">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="goes"
          />
        </a-form-item>
      </template>

      <!-- ============ GRAMMAR_SENTENCE_CHOICE ============ -->
      <template v-else-if="exerciseType === 'GRAMMAR_SENTENCE_CHOICE'">
        <a-form-item label="Các câu lựa chọn">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_sentences_${i}`, { rules: [{ required: true, message: 'Nhập câu' }] }]"
              :placeholder="`Câu ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm câu</a-button>
        </a-form-item>
        <a-form-item label="Đáp án đúng (nhập nguyên câu)">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="She has gone to school."
          />
        </a-form-item>
      </template>

      <!-- ============ GRAMMAR_FIND_ERROR ============ -->
      <template v-else-if="exerciseType === 'GRAMMAR_FIND_ERROR'">
        <a-form-item label="Câu gốc (sentence)">
          <a-textarea
            v-decorator="['question_sentence', { rules: [{ required: true, message: 'Nhập câu' }] }]"
            placeholder="They (A) has completed the project (B) earlier this week..."
            :rows="2"
          />
        </a-form-item>
        <div class="mb-2 text-sm text-gray-600 font-medium">Các phần (A, B, C, D)</div>
        <div v-for="key in ['A','B','C','D']" :key="key" class="flex items-center gap-2 mb-2">
          <span class="font-bold text-gray-500 w-6">({{ key }})</span>
          <a-form-item class="mb-0 flex-1">
            <a-input
              v-decorator="[`question_parts_${key}`, { rules: [{ required: true, message: 'Nhập nội dung' }] }]"
              :placeholder="`Nội dung phần ${key}`"
            />
          </a-form-item>
        </div>
        <a-form-item label="Đáp án (vd: a-has)">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="a-has"
          />
        </a-form-item>
      </template>

      <!-- ============ GRAMMAR_REORDER / WRITE_REORDER ============ -->
      <template v-else-if="exerciseType === 'GRAMMAR_REORDER' || exerciseType === 'WRITE_REORDER'">
        <a-form-item :label="exerciseType === 'WRITE_REORDER' ? 'Các từ (words)' : 'Các từ (scrambled)'">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_words_${i}`, { rules: [{ required: true, message: 'Nhập từ' }] }]"
              :placeholder="`Từ ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm từ</a-button>
        </a-form-item>
        <a-form-item label="Đáp án (câu hoàn chỉnh)">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="It is raining outside"
          />
        </a-form-item>
      </template>

      <!-- ============ GRAMMAR_REWRITE / WRITE_REWRITE ============ -->
      <template v-else-if="exerciseType === 'GRAMMAR_REWRITE' || exerciseType === 'WRITE_REWRITE'">
        <a-form-item label="Câu gốc (original)">
          <a-input
            v-decorator="['question_original', { rules: [{ required: true, message: 'Nhập câu gốc' }] }]"
            placeholder="She go to school."
          />
        </a-form-item>
        <a-form-item label="Hướng dẫn (instruction)">
          <a-input
            v-decorator="['question_instruction']"
            placeholder="Rewrite correctly."
          />
        </a-form-item>
        <a-form-item label="Đáp án đúng">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="She goes to school."
          />
        </a-form-item>
      </template>

      <!-- ============ READ_MCQ ============ -->
      <template v-else-if="exerciseType === 'READ_MCQ'">
        <a-form-item label="Câu hỏi">
          <a-input
            v-decorator="['question_question', { rules: [{ required: true, message: 'Nhập câu hỏi' }] }]"
            placeholder="Which appliance tells you to buy food?"
          />
        </a-form-item>
        <a-form-item label="Các lựa chọn">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_options_${i}`, { rules: [{ required: true, message: 'Nhập lựa chọn' }] }]"
              :placeholder="`Lựa chọn ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm lựa chọn</a-button>
        </a-form-item>
        <a-form-item label="Đáp án đúng">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="Refrigerator"
          />
        </a-form-item>
      </template>

      <!-- ============ READ_QA ============ -->
      <template v-else-if="exerciseType === 'READ_QA'">
        <a-form-item label="Câu hỏi">
          <a-textarea
            v-decorator="['question_question', { rules: [{ required: true, message: 'Nhập câu hỏi' }] }]"
            placeholder="What is included in robots so they can operate automatically?"
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="Đáp án">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="Sensors, actuators, and software"
          />
        </a-form-item>
      </template>

      <!-- ============ READ_FILL ============ -->
      <template v-else-if="exerciseType === 'READ_FILL'">
        <a-form-item label="Câu điền vào chỗ trống (dùng ___ để đánh dấu chỗ trống)">
          <a-textarea
            v-decorator="['question_question', { rules: [{ required: true, message: 'Nhập câu' }] }]"
            placeholder="The operating system lies between _______________ and hardware."
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="Các đáp án chấp nhận (mỗi dòng 1 đáp án)">
          <a-textarea
            v-decorator="['answers_text', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="application software"
            :rows="3"
          />
          <div class="text-xs text-gray-400 mt-1">Nhiều đáp án thì mỗi dòng 1 cái</div>
        </a-form-item>
      </template>

      <!-- ============ LISTEN_FILL ============ -->
      <template v-else-if="exerciseType === 'LISTEN_FILL'">
        <a-form-item label="Câu nghe (dùng ___ để đánh dấu chỗ trống)">
          <a-textarea
            v-decorator="['question_sentence', { rules: [{ required: true, message: 'Nhập câu' }] }]"
            placeholder="Lily believes it's important to say no to plagiarism and respect ______."
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="Các đáp án chấp nhận (mỗi dòng 1 đáp án)">
          <a-textarea
            v-decorator="['answers_text', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="intellectual property"
            :rows="3"
          />
          <div class="text-xs text-gray-400 mt-1">Nhiều đáp án thì mỗi dòng 1 cái</div>
        </a-form-item>
      </template>

      <!-- ============ LISTEN_QA ============ -->
      <template v-else-if="exerciseType === 'LISTEN_QA'">
        <a-form-item label="Câu hỏi">
          <a-textarea
            v-decorator="['question_question', { rules: [{ required: true, message: 'Nhập câu hỏi' }] }]"
            placeholder="How many examples are mentioned...?"
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="Các đáp án chấp nhận (mỗi dòng 1 đáp án)">
          <a-textarea
            v-decorator="['answers_text', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="three&#10;3"
            :rows="3"
          />
          <div class="text-xs text-gray-400 mt-1">Nhiều đáp án thì mỗi dòng 1 cái</div>
        </a-form-item>
      </template>

      <!-- ============ WRITE_FIX ============ -->
      <template v-else-if="exerciseType === 'WRITE_FIX'">
        <a-form-item label="Câu sai cần sửa (sentence)">
          <a-input
            v-decorator="['question_sentence', { rules: [{ required: true, message: 'Nhập câu' }] }]"
            placeholder="She dont like reading books."
          />
        </a-form-item>
        <a-form-item label="Đáp án đúng">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="She does not like reading books."
          />
        </a-form-item>
      </template>

      <!-- ============ WRITE_REORDER_GROUP ============ -->
      <template v-else-if="exerciseType === 'WRITE_REORDER_GROUP'">
        <a-form-item label="Các nhóm từ (groups)">
          <div v-for="(_, i) in optionCount" :key="i" class="flex gap-2 mb-2">
            <a-input
              v-decorator="[`question_groups_${i}`, { rules: [{ required: true, message: 'Nhập nhóm từ' }] }]"
              :placeholder="`Nhóm ${i + 1}`"
            />
            <a-button v-if="optionCount > 2" type="link" icon="minus-circle" class="text-red-400" @click="removeOption(i)" />
          </div>
          <a-button type="dashed" icon="plus" @click="addOption">Thêm nhóm</a-button>
        </a-form-item>
        <a-form-item label="Đáp án (câu hoàn chỉnh)">
          <a-input
            v-decorator="['answer', { rules: [{ required: true, message: 'Nhập đáp án' }] }]"
            placeholder="By 2050, everyone will have owned a smartphone and a laptop"
          />
        </a-form-item>
      </template>

      <!-- ============ Fallback: type chưa hỗ trợ ============ -->
      <template v-else>
        <a-alert type="warning" :message="`Chưa có form cho loại '${exerciseType}'. Vui lòng liên hệ dev.`" show-icon />
      </template>

    </a-form>
  </a-modal>
</template>

<script>
import { createExerciseItem, updateExerciseItem } from "@/apis/exercise";

export default {
  name: "ItemModal",
  props: {
    visible: { type: Boolean, default: false },
    // Truyền selectedExercise từ ExerciseItemsPane
    selectedExercise: { type: Object, default: null },
    // Truyền item khi edit, null khi create
    initialValues: { type: Object, default: null },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      optionCount: 3,
      submitLoading: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.initialValues?.id;
    },
    exerciseType() {
      return this.selectedExercise?.type || "";
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => this.fillForm());
      } else {
        this.form.resetFields();
        this.optionCount = 3;
      }
    },
  },
  methods: {
    addOption() {
      this.optionCount += 1;
    },
    removeOption(index) {
      // Shift values down
      const type = this.exerciseType;
      const fieldPrefix = this.getOptionFieldPrefix(type);
      const values = this.form.getFieldsValue();
      for (let i = index; i < this.optionCount - 1; i++) {
        this.form.setFieldsValue({ [`${fieldPrefix}${i}`]: values[`${fieldPrefix}${i + 1}`] });
      }
      this.optionCount -= 1;
    },

    getOptionFieldPrefix(type) {
      if (['VOCAB_MATCH'].includes(type)) return 'question_right_options_';
      if (['GRAMMAR_SENTENCE_CHOICE'].includes(type)) return 'question_sentences_';
      if (['GRAMMAR_REORDER', 'WRITE_REORDER'].includes(type)) return 'question_words_';
      if (['WRITE_REORDER_GROUP'].includes(type)) return 'question_groups_';
      return 'question_options_';
    },

    fillForm() {
      if (!this.isEdit || !this.initialValues) return;
      const item = this.initialValues;
      const q = item.question || {};
      const a = item.answer || {};
      const type = this.exerciseType;
      const fields = { position: item.position };

      // Fill answer string
      if (typeof a.answer === 'string') fields.answer = a.answer;

      // Fill answers array => multiline text
      if (Array.isArray(a.answers)) fields.answers_text = a.answers.join('\n');

      // Fill question fields per type
      if (type === 'VOCAB_MATCH') {
        fields.question_left = q.left;
        const opts = q.right_options || [];
        this.optionCount = opts.length || 3;
        opts.forEach((o, i) => { fields[`question_right_options_${i}`] = o; });
      } else if (type === 'VOCAB_MEANING_CHOICE') {
        fields.question_word = q.word;
        const opts = q.options || [];
        this.optionCount = opts.length || 3;
        opts.forEach((o, i) => { fields[`question_options_${i}`] = o; });
      } else if (type === 'VOCAB_PHONETIC') {
        fields.question_phonetic = q.phonetic;
      } else if (type === 'VOCAB_PATTERN_FILL') {
        fields.question_pattern = q.pattern;
        fields.question_sentence = q.sentence;
      } else if (type === 'GRAMMAR_MCQ' || type === 'READ_MCQ') {
        fields.question_question = q.question;
        const opts = q.options || [];
        this.optionCount = opts.length || 3;
        opts.forEach((o, i) => { fields[`question_options_${i}`] = o; });
      } else if (type === 'GRAMMAR_SENTENCE_CHOICE') {
        const sentences = q.sentences || [];
        this.optionCount = sentences.length || 3;
        sentences.forEach((s, i) => { fields[`question_sentences_${i}`] = s; });
      } else if (type === 'GRAMMAR_FIND_ERROR') {
        fields.question_sentence = q.sentence;
        Object.entries(q.parts || {}).forEach(([k, v]) => { fields[`question_parts_${k}`] = v; });
      } else if (type === 'GRAMMAR_REORDER' || type === 'WRITE_REORDER') {
        const words = q.scrambled || q.words || [];
        this.optionCount = words.length || 3;
        words.forEach((w, i) => { fields[`question_words_${i}`] = w; });
      } else if (type === 'GRAMMAR_REWRITE' || type === 'WRITE_REWRITE') {
        fields.question_original = q.original;
        fields.question_instruction = q.instruction;
      } else if (type === 'READ_QA' || type === 'LISTEN_QA') {
        fields.question_question = q.question;
        if (Array.isArray(a.answers)) fields.answers_text = a.answers.join('\n');
      } else if (type === 'READ_FILL' || type === 'LISTEN_FILL') {
        fields.question_question = q.question;
        fields.question_sentence = q.sentence;
        if (Array.isArray(a.answers)) fields.answers_text = a.answers.join('\n');
      } else if (type === 'WRITE_FIX') {
        fields.question_sentence = q.sentence;
      } else if (type === 'WRITE_REORDER_GROUP') {
        const groups = q.groups || [];
        this.optionCount = groups.length || 3;
        groups.forEach((g, i) => { fields[`question_groups_${i}`] = g; });
      }

      this.$nextTick(() => this.form.setFieldsValue(fields));
    },

    buildPayload(values) {
      const type = this.exerciseType;
      let question = {};
      let answer = {};

      // Build answer
      const answersText = values.answers_text;
      if (answersText !== undefined) {
        answer = { answers: answersText.split('\n').map(s => s.trim()).filter(Boolean) };
      } else {
        answer = { answer: values.answer };
      }

      // Build question per type
      if (type === 'VOCAB_MATCH') {
        question = {
          left: values.question_left,
          right_options: Array.from({ length: this.optionCount }, (_, i) => values[`question_right_options_${i}`]).filter(Boolean),
        };
      } else if (type === 'VOCAB_MEANING_CHOICE') {
        question = {
          word: values.question_word,
          options: Array.from({ length: this.optionCount }, (_, i) => values[`question_options_${i}`]).filter(Boolean),
        };
      } else if (type === 'VOCAB_PHONETIC') {
        question = { phonetic: values.question_phonetic };
      } else if (type === 'VOCAB_PATTERN_FILL') {
        question = { pattern: values.question_pattern, sentence: values.question_sentence };
      } else if (type === 'GRAMMAR_MCQ' || type === 'READ_MCQ') {
        question = {
          question: values.question_question,
          options: Array.from({ length: this.optionCount }, (_, i) => values[`question_options_${i}`]).filter(Boolean),
          ...(type === 'READ_MCQ' && this.initialValues?.question?.passage_id
            ? { passage_id: this.initialValues.question.passage_id } : {}),
        };
      } else if (type === 'GRAMMAR_SENTENCE_CHOICE') {
        const sentences = Array.from({ length: this.optionCount }, (_, i) => values[`question_sentences_${i}`]).filter(Boolean);
        question = { sentences, answer_index: sentences.indexOf(values.answer) };
      } else if (type === 'GRAMMAR_FIND_ERROR') {
        question = {
          sentence: values.question_sentence,
          parts: { A: values.question_parts_A, B: values.question_parts_B, C: values.question_parts_C, D: values.question_parts_D },
        };
      } else if (type === 'GRAMMAR_REORDER') {
        question = { scrambled: Array.from({ length: this.optionCount }, (_, i) => values[`question_words_${i}`]).filter(Boolean) };
      } else if (type === 'WRITE_REORDER') {
        question = { words: Array.from({ length: this.optionCount }, (_, i) => values[`question_words_${i}`]).filter(Boolean) };
      } else if (type === 'GRAMMAR_REWRITE' || type === 'WRITE_REWRITE') {
        question = { original: values.question_original, instruction: values.question_instruction };
      } else if (type === 'READ_QA' || type === 'LISTEN_QA') {
        question = {
          question: values.question_question,
          ...(this.initialValues?.question?.passage_id ? { passage_id: this.initialValues.question.passage_id } : {}),
        };
      } else if (type === 'READ_FILL') {
        question = { question: values.question_question };
      } else if (type === 'LISTEN_FILL') {
        question = { sentence: values.question_sentence };
      } else if (type === 'WRITE_FIX') {
        question = { sentence: values.question_sentence };
      } else if (type === 'WRITE_REORDER_GROUP') {
        question = { groups: Array.from({ length: this.optionCount }, (_, i) => values[`question_groups_${i}`]).filter(Boolean) };
      }

      return {
        exerciseId: this.selectedExercise?.id,
        position: values.position,
        question,
        answer,
      };
    },

    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (err) return;
        this.submitLoading = true;
        try {
          const payload = this.buildPayload(values);
          if (this.isEdit) {
            await updateExerciseItem(this.initialValues.id, payload);
            this.$message.success("Cập nhật exercise item thành công");
          } else {
            await createExerciseItem(payload);
            this.$message.success("Thêm exercise item thành công");
          }
          this.$emit("success");
          this.$emit("close");
        } catch (error) {
          this.$message.error(error?.message || "Không thể lưu exercise item");
        } finally {
          this.submitLoading = false;
        }
      });
    },
  },
};
</script>
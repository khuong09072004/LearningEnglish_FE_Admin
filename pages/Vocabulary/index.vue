<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Quản lí từ vựng</h1>
				<p class="text-sm text-gray-500 mt-1">Danh sách từ vựng trong hệ thống</p>
			</div>
			<a-button type="primary" icon="plus" @click="openCreateModal">Thêm từ vựng</a-button>
		</div>

		<div class="mb-4 flex items-center gap-3">
			<span class="text-sm text-gray-600">Lọc theo chủ đề:</span>
			<a-select
				:value="selectedTopicFilterId"
				placeholder="Tất cả chủ đề"
				style="width: 260px"
				allow-clear
				@change="handleTopicFilterChange"
			>
				<a-select-option v-for="item in topicOptions" :key="item.id" :value="item.id">
					{{ item.name }}
				</a-select-option>
			</a-select>
		</div>

		<a-card :bordered="false" class="shadow-sm">
			<a-table
				:columns="columns"
				:data-source="filteredVocabularies"
				:loading="loading"
				:pagination="{ pageSize: 10, showSizeChanger: true }"
				row-key="id"
			>
				<template slot="word" slot-scope="word">
					<span class="font-semibold text-gray-800">{{ word || "-" }}</span>
				</template>

				<template slot="meaning" slot-scope="meaning">
					<span class="text-gray-700">{{ meaning || "-" }}</span>
				</template>

				<template slot="topic" slot-scope="topicName">
					<a-tag color="blue">{{ topicName || "-" }}</a-tag>
				</template>

				<template slot="image" slot-scope="imageUrl">
					<img
						v-if="imageUrl"
						:src="imageUrl"
						alt="vocabulary"
						class="w-12 h-12 rounded object-cover border"
					/>
					<span v-else class="text-gray-400">-</span>
				</template>

				<template slot="action" slot-scope="record">
					<TableActionButtons
						delete-confirm-title="Bạn có chắc muốn xóa từ vựng này?"
						@edit="openEditModal(record.id)"
						@delete="handleDelete(record.id)"
					/>
				</template>
			</a-table>
		</a-card>

		<a-modal
			:title="isEditMode ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng'"
			:visible="modalVisible"
			:confirm-loading="submitLoading"
			:ok-text="isEditMode ? 'Cập nhật' : 'Tạo mới'"
			cancel-text="Hủy"
			width="720px"
			@ok="handleSubmit"
			@cancel="closeModal"
		>
			<a-form layout="vertical">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<a-form-item label="Từ vựng">
						<a-input v-model="form.word" placeholder="Nhập từ vựng" :max-length="100" />
					</a-form-item>

					<a-form-item label="Chủ đề">
						<a-select v-model="form.topicId" placeholder="Chọn chủ đề">
							<a-select-option
								v-for="item in topicOptions"
								:key="item.id"
								:value="item.id"
							>
								{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</div>

				<a-form-item label="Nghĩa">
					<a-textarea
						v-model="form.meaning"
						placeholder="Nhập nghĩa của từ"
						:auto-size="{ minRows: 2, maxRows: 4 }"
					/>
				</a-form-item>

				<a-form-item label="Phiên âm">
					<a-input
						v-model="form.pronunciation"
						placeholder="Ví dụ: /həˈləʊ/"
						:max-length="100"
					/>
				</a-form-item>

				<a-form-item label="Ví dụ">
					<a-textarea
						v-model="form.example"
						placeholder="Nhập ví dụ"
						:auto-size="{ minRows: 2, maxRows: 4 }"
					/>
				</a-form-item>

				<a-form-item label="Ảnh minh họa">
					<a-upload
						:file-list="fileList"
						:before-upload="() => false"
						:remove="handleRemoveFile"
						@change="handleFileChange"
					>
						<a-button icon="upload">Chọn ảnh</a-button>
					</a-upload>
					<div v-if="form.imageUrl" class="mt-2 text-xs text-gray-500">
						Ảnh hiện tại: {{ form.imageUrl }}
					</div>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import {
	createVocabulary,
	deleteVocabulary,
	getListVocabulary,
	getVocabularyById,
	updateVocabulary,
} from "@/apis/vocabularies";
import { getListTopic } from "@/apis/topics";
import TableActionButtons from "@/components/common/TableActionButtons.vue";

export default {
	name: "VocabularyPage",
	layout: "admin",
	components: {
		TableActionButtons,
	},
	data() {
		return {
			vocabularies: [],
			topicOptions: [],
			selectedTopicFilterId: undefined,
			loading: false,
			submitLoading: false,
			modalVisible: false,
			isEditMode: false,
			editingId: null,
			fileList: [],
			form: {
				word: "",
				meaning: "",
				pronunciation: "",
				example: "",
				topicId: undefined,
				imageFile: null,
				imageUrl: "",
			},
			columns: [
				{
					title: "ID",
					dataIndex: "id",
					width: 80,
					align: "center",
				},
				{
					title: "Từ vựng",
					dataIndex: "word",
					scopedSlots: { customRender: "word" },
					width: 180,
				},
				{
					title: "Nghĩa",
					dataIndex: "meaning",
					scopedSlots: { customRender: "meaning" },
				},
				{
					title: "Chủ đề",
					dataIndex: "topicName",
					scopedSlots: { customRender: "topic" },
					width: 150,
					align: "center",
				},
				{
					title: "Ảnh",
					dataIndex: "imageUrl",
					scopedSlots: { customRender: "image" },
					width: 100,
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
	computed: {
		filteredVocabularies() {
			if (
				this.selectedTopicFilterId === undefined ||
				this.selectedTopicFilterId === null ||
				this.selectedTopicFilterId === ""
			) {
				return this.vocabularies;
			}

			return this.vocabularies.filter(
				(item) => String(item.topicId) === String(this.selectedTopicFilterId)
			);
		},
	},
	async created() {
		await this.fetchTopics();
		await this.fetchVocabularies();
	},
	methods: {
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

		normalizeTopic(item) {
			return {
				id: item?.id,
				name: item?.name || "",
			};
		},

		findTopicByAnyValue(value) {
			if (value === undefined || value === null || value === "") return null;

			const normalized = String(value).trim().toUpperCase();
			return (
				this.topicOptions.find(
					(topic) => topic.id === value || String(topic.id) === String(value)
				) ||
				this.topicOptions.find((topic) => (topic.name || "").toUpperCase() === normalized) ||
				null
			);
		},

		normalizeVocabulary(item) {
			const nestedTopic = item?.topic && typeof item.topic === "object" ? item.topic : null;
			const sourceTopicValue =
				item?.topicId ||
				item?.topic_id ||
				nestedTopic?.id ||
				nestedTopic?.name ||
				item?.topicName;
			const matchedTopic = this.findTopicByAnyValue(sourceTopicValue);

			return {
				id: item?.id,
				word: item?.word || item?.vocab || item?.vocabulary || item?.term || "",
				meaning: item?.meaning || item?.definition || "",
				pronunciation: item?.pronunciation || item?.phonetic || "",
				example: item?.example || item?.exampleSentence || "",
				topicId: matchedTopic?.id || item?.topicId || item?.topic_id || nestedTopic?.id,
				topicName: matchedTopic?.name || nestedTopic?.name || item?.topicName || "",
				imageUrl:
					item?.imageUrl || item?.image || item?.thumbnail || item?.image_url || "",
			};
		},

		async fetchTopics() {
			try {
				const res = await getListTopic();
				const rawTopics = this.extractListData(res);
				this.topicOptions = rawTopics.map((item) => this.normalizeTopic(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách chủ đề!");
			}
		},

		async fetchVocabularies() {
			this.loading = true;
			try {
				const res = await getListVocabulary();
				const rawVocabularies = this.extractListData(res);
				this.vocabularies = rawVocabularies.map((item) => this.normalizeVocabulary(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách từ vựng!");
			} finally {
				this.loading = false;
			}
		},

		handleTopicFilterChange(value) {
			this.selectedTopicFilterId = value;
		},

		openCreateModal() {
			this.isEditMode = false;
			this.editingId = null;
			this.form = {
				word: "",
				meaning: "",
				pronunciation: "",
				example: "",
				topicId: undefined,
				imageFile: null,
				imageUrl: "",
			};
			this.fileList = [];
			this.modalVisible = true;
		},

		async openEditModal(id) {
			this.isEditMode = true;
			this.editingId = id;
			this.submitLoading = true;
			try {
				const res = await getVocabularyById(id);
				const vocab = this.normalizeVocabulary(this.extractObjectData(res) || {});
				this.form = {
					word: vocab.word || "",
					meaning: vocab.meaning || "",
					pronunciation: vocab.pronunciation || "",
					example: vocab.example || "",
					topicId: vocab.topicId || undefined,
					imageFile: null,
					imageUrl: vocab.imageUrl || "",
				};
				this.fileList = [];
				this.modalVisible = true;
			} catch (error) {
				this.$message.error("Không thể tải chi tiết từ vựng!");
			} finally {
				this.submitLoading = false;
			}
		},

		closeModal() {
			this.modalVisible = false;
		},

		handleFileChange({ fileList }) {
			this.fileList = fileList.slice(-1);
			this.form.imageFile = this.fileList[0]?.originFileObj || null;
		},

		handleRemoveFile() {
			this.fileList = [];
			this.form.imageFile = null;
			return true;
		},

		buildRequestPayload() {
			return {
				word: this.form.word.trim(),
				meaning: this.form.meaning.trim(),
				pronunciation: (this.form.pronunciation || "").trim(),
				example: (this.form.example || "").trim(),
				topicId: this.form.topicId,
			};
		},

		async handleSubmit() {
			if (!this.form.word || !this.form.meaning || !this.form.topicId) {
				this.$message.warning("Vui lòng nhập đầy đủ từ vựng, nghĩa và chủ đề.");
				return;
			}

			const body = {
				req: this.buildRequestPayload(),
				imageFile: this.form.imageFile,
			};

			this.submitLoading = true;
			try {
				if (this.isEditMode) {
					await updateVocabulary(this.editingId, body);
					this.$message.success("Cập nhật từ vựng thành công!");
				} else {
					await createVocabulary(body);
					this.$message.success("Thêm từ vựng thành công!");
				}

				this.modalVisible = false;
				await this.fetchVocabularies();
			} catch (error) {
				this.$message.error(
					this.isEditMode ? "Không thể cập nhật từ vựng." : "Không thể thêm từ vựng."
				);
			} finally {
				this.submitLoading = false;
			}
		},

		async handleDelete(id) {
			try {
				await deleteVocabulary(id);
				this.$message.success("Xóa từ vựng thành công!");
				await this.fetchVocabularies();
			} catch (error) {
				this.$message.error("Không thể xóa từ vựng.");
			}
		},
	},
};
</script>

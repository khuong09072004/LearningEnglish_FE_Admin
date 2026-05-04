<template>
	<div class="p-6">
		<TopicsHeader
			:level-options="levelOptions"
			:selected-level-id="selectedLevelFilterId"
			:loading="levelsLoading"
			@create="openCreateModal"
			@change-level-filter="handleLevelFilterChange"
		/>

		<TopicsTable
			:topics="filteredTopics"
			:loading="loading"
			@edit="openEditModal"
			@delete="handleDelete"
		/>

		<TopicFormModal
			:visible="modalVisible"
			:submit-loading="submitLoading"
			:is-edit-mode="isEditMode"
			:form="form"
			:level-options="levelOptions"
			@submit="handleSubmit"
			@close="closeModal"
		/>
	</div>
</template>

<script>
import {
	createTopic,
	deleteTopic,
	getListTopic,
	getTopicById,
	updateTopic,
} from "@/apis/topics";
import { getListLevel } from "@/apis/levels";
import TopicFormModal from "@/components/topics/TopicFormModal.vue";
import TopicsHeader from "@/components/topics/TopicsHeader.vue";
import TopicsTable from "@/components/topics/TopicsTable.vue";

export default {
	name: "TopicsPage",
	layout: "admin",
	components: {
		TopicFormModal,
		TopicsHeader,
		TopicsTable,
	},
	data() {
		return {
			topics: [],
			levels: [],
			selectedLevelFilterId: undefined,
			loading: false,
			levelsLoading: false,
			submitLoading: false,
			modalVisible: false,
			isEditMode: false,
			editingId: null,
			form: {
				name: "",
				levelId: undefined,
			},
			levelOptions: [],
		};
	},
	computed: {
		filteredTopics() {
			if (
				this.selectedLevelFilterId === undefined ||
				this.selectedLevelFilterId === null ||
				this.selectedLevelFilterId === ""
			) {
				return this.topics;
			}

			return this.topics.filter(
				(item) => String(item.levelId) === String(this.selectedLevelFilterId)
			);
		},
	},
	async created() {
		await this.fetchLevels();
		await this.fetchTopics();
	},
	methods: {
		handleLevelFilterChange(value) {
			this.selectedLevelFilterId = value;
		},

		async fetchLevels() {
			this.levelsLoading = true;
			try {
				const res = await getListLevel();
				const rawLevels = this.extractListData(res);
				this.levels = rawLevels.map((item) => this.normalizeLevel(item));
				this.levelOptions = this.levels;
			} catch (error) {
				this.$message.error("Không thể tải danh sách cấp độ!");
			} finally {
				this.levelsLoading = false;
			}
		},

		async fetchTopics() {
			this.loading = true;
			try {
				const res = await getListTopic();
				const rawTopics = this.extractListData(res);
				this.topics = rawTopics.map((item) => this.normalizeTopic(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách chủ đề!");
			} finally {
				this.loading = false;
			}
		},

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

		normalizeLevel(item) {
			return {
				id: item?.id,
				code: item?.code || "",
				name: item?.name || "",
			};
		},

		findLevelByAnyValue(value) {
			if (value === undefined || value === null || value === "") return null;

			const normalized = String(value).trim().toUpperCase();
			return (
				this.levels.find((level) => level.id === value || String(level.id) === String(value)) ||
				this.levels.find((level) => (level.code || "").toUpperCase() === normalized) ||
				this.levels.find((level) => (level.name || "").toUpperCase() === normalized) ||
				null
			);
		},

		normalizeTopic(item) {
			const nestedLevel = item?.level && typeof item.level === "object" ? item.level : null;
			const sourceLevelValue =
				item?.levelId ||
				item?.level_id ||
				nestedLevel?.id ||
				nestedLevel?.code ||
				nestedLevel?.name ||
				item?.level ||
				item?.levelCode ||
				item?.levelName;
			const matchedLevel = this.findLevelByAnyValue(sourceLevelValue);

			return {
				id: item?.id,
				name: item?.name || "",
				levelId: matchedLevel?.id || item?.levelId || item?.level_id || nestedLevel?.id,
				levelCode:
					matchedLevel?.code ||
					nestedLevel?.code ||
					(typeof item?.level === "string" ? item.level : ""),
			};
		},

		openCreateModal() {
			this.isEditMode = false;
			this.editingId = null;
			this.form = {
				name: "",
				levelId: undefined,
			};
			this.modalVisible = true;
		},

		async openEditModal(id) {
			this.isEditMode = true;
			this.editingId = id;
			this.submitLoading = true;
			try {
				const res = await getTopicById(id);
				const topic = this.normalizeTopic(this.extractObjectData(res) || {});
				this.form = {
					name: topic.name || "",
					levelId: topic.levelId || undefined,
				};
				this.modalVisible = true;
			} catch (error) {
				this.$message.error("Không thể tải chi tiết chủ đề!");
			} finally {
				this.submitLoading = false;
			}
		},

		closeModal() {
			this.modalVisible = false;
		},

		async handleSubmit(formData) {
			if (!formData.name || !formData.levelId) {
				this.$message.warning("Vui lòng nhập đầy đủ tên chủ đề và cấp độ.");
				return;
			}

			const payload = {
				name: formData.name,
				levelId: formData.levelId,
			};

			this.submitLoading = true;
			try {
				if (this.isEditMode) {
					await updateTopic(this.editingId, payload);
					this.$message.success("Cập nhật chủ đề thành công!");
				} else {
					await createTopic(payload);
					this.$message.success("Thêm chủ đề thành công!");
				}

				this.modalVisible = false;
				await this.fetchTopics();
			} catch (error) {
				this.$message.error(
					this.isEditMode ? "Không thể cập nhật chủ đề." : "Không thể thêm chủ đề."
				);
			} finally {
				this.submitLoading = false;
			}
		},

		async handleDelete(id) {
			try {
				await deleteTopic(id);
				this.$message.success("Xóa chủ đề thành công!");
				await this.fetchTopics();
			} catch (error) {
				this.$message.error("Không thể xóa chủ đề.");
			}
		},
	},
};
</script>

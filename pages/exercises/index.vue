<template>
	<div class="p-6 space-y-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Quản lí bài tập</h1>
				<p class="text-sm text-gray-500 mt-1">Gồm phần quản lí exercise và exercise-item</p>
			</div>
			<div class="flex items-center gap-2">
				<a-button @click="fetchExercises" :loading="exercisesLoading">Làm mới</a-button>
				<a-button type="primary" icon="plus" @click="openCreateExerciseModal">Thêm bài tập</a-button>
			</div>
		</div>

		<ExercisesTable
			:exercises="exercises"
			:loading="exercisesLoading"
			@view-items="openExerciseItems"
			@edit="openEditExerciseModal"
			@delete="handleDeleteExercise"
		/>

		<ExerciseItemsPane
			:selected-exercise="selectedExercise"
			:items="exerciseItems"
			:loading="itemsLoading"
			@refresh-items="fetchExerciseItems"
			@edit-item="openEditItemModal"
			@delete-item="handleDeleteItem"
		/>

		<ExerciseModal
			:visible="exerciseModalVisible"
			:is-edit-mode="isEditExerciseMode"
			:submit-loading="exerciseSubmitLoading"
			:req-json-text="exerciseReqJsonText"
			:audio-file-list="audioFileList"
			:current-audio-url="exerciseForm.currentAudioUrl"
			@submit="handleExerciseSubmit"
			@close="closeExerciseModal"
			@audio-change="handleAudioChange"
			@remove-audio="handleRemoveAudio"
			@change-req-json="exerciseReqJsonText = $event"
		/>

		<ItemModal
			:visible="itemModalVisible"
			:submit-loading="itemSubmitLoading"
			:json-text="itemJsonText"
			@submit="handleItemSubmit"
			@close="closeItemModal"
			@change-json="itemJsonText = $event"
		/>
	</div>
</template>

<script>
import ExerciseItemsPane from "@/components/exercises/ExerciseItemsPane";
import ExerciseModal from "@/components/exercises/ExerciseModal";
import ExercisesTable from "@/components/exercises/ExercisesTable";
import ItemModal from "@/components/exercises/ItemModal";
import {
	createExercise,
	deleteExercise,
	deleteExerciseItem,
	getExerciseById,
	getExerciseItemById,
	getExerciseItemsByExercise,
	getExercises,
	updateExercise,
	updateExerciseItem,
} from "@/apis/exercise";

export default {
	name: "ExercisesPage",
	layout: "admin",
	components: {
		ExerciseItemsPane,
		ExerciseModal,
		ExercisesTable,
		ItemModal,
	},
	data() {
		return {
			exercises: [],
			exerciseItems: [],
			selectedExercise: null,
			exercisesLoading: false,
			itemsLoading: false,
			exerciseSubmitLoading: false,
			itemSubmitLoading: false,

			exerciseModalVisible: false,
			isEditExerciseMode: false,
			editingExerciseId: null,
			exerciseReqJsonText: "{}",
			audioFileList: [],
			audioFile: null,
			exerciseForm: {
				req: {},
				audioFile: null,
				currentAudioUrl: "",
			},

			itemModalVisible: false,
			editingItemId: null,
			itemJsonText: "{}",
		};
	},
	async created() {
		await this.fetchExercises();
	},
	methods: {
		extractListData(res) {
			if (Array.isArray(res)) return res;
			if (Array.isArray(res?.data)) return res.data;
			if (Array.isArray(res?.result)) return res.result;
			if (Array.isArray(res?.data?.data)) return res.data.data;
			return [];
		},

		extractObjectData(res) {
			if (res && typeof res === "object" && res.data && !Array.isArray(res.data)) {
				return res.data;
			}
			if (res && typeof res === "object" && res.data?.data && !Array.isArray(res.data.data)) {
				return res.data.data;
			}
			return res;
		},

		parseJson(text, fallback = {}) {
			if (!text) return fallback;
			try {
				return JSON.parse(text);
			} catch (error) {
				throw new Error("JSON không hợp lệ");
			}
		},

		normalizeExercise(item) {
			return {
				...item,
				id: item?.id,
				title: item?.title || item?.name || item?.exerciseName || "",
				description: item?.description || item?.content || "",
				topicId: item?.topicId || item?.topic?.id || item?.topic_id,
				topicName: item?.topicName || item?.topic?.name || "",
				raw: item,
			};
		},

		normalizeExerciseItem(item) {
			return {
				...item,
				id: item?.id,
				raw: item,
			};
		},

		handleAudioChange(info) {
			const file = info?.file?.originFileObj || info?.file;
			this.audioFile = file || null;
			this.audioFileList = file
				? [
						{
							uid: file.uid || Date.now().toString(),
							name: file?.name || "audio-file",
							status: "done",
						},
				  ]
				: [];
		},

		handleRemoveAudio() {
			this.audioFile = null;
			this.audioFileList = [];
			return true;
		},

		async fetchExercises() {
			this.exercisesLoading = true;
			try {
				const res = await getExercises();
				const rawExercises = this.extractListData(res);
				this.exercises = rawExercises.map((item) => this.normalizeExercise(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách bài tập");
			} finally {
				this.exercisesLoading = false;
			}
		},

		async openExerciseItems(record) {
			this.selectedExercise = record;
			await this.fetchExerciseItems();
		},

		async fetchExerciseItems() {
			if (!this.selectedExercise?.id) return;
			this.itemsLoading = true;
			try {
				const res = await getExerciseItemsByExercise(this.selectedExercise.id);
				const rawItems = this.extractListData(res);
				this.exerciseItems = rawItems.map((item) => this.normalizeExerciseItem(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách exercise-item");
			} finally {
				this.itemsLoading = false;
			}
		},

		openCreateExerciseModal() {
			this.isEditExerciseMode = false;
			this.editingExerciseId = null;
			this.exerciseReqJsonText = "{}";
			this.audioFile = null;
			this.audioFileList = [];
			this.exerciseForm = {
				req: {},
				audioFile: null,
				currentAudioUrl: "",
			};
			this.exerciseModalVisible = true;
		},

		async openEditExerciseModal(id) {
			this.isEditExerciseMode = true;
			this.editingExerciseId = id;
			this.exerciseSubmitLoading = true;
			try {
				const res = await getExerciseById(id);
				const exercise = this.normalizeExercise(this.extractObjectData(res) || {});
				const reqPayload = { ...exercise };
				delete reqPayload.raw;
				this.exerciseReqJsonText = this.stringifyJson(reqPayload);
				this.exerciseForm.currentAudioUrl = exercise?.audioUrl || exercise?.audioFileUrl || exercise?.audio || "";
				this.audioFile = null;
				this.audioFileList = [];
				this.exerciseModalVisible = true;
			} catch (error) {
				this.$message.error("Không thể tải chi tiết bài tập");
			} finally {
				this.exerciseSubmitLoading = false;
			}
		},

		closeExerciseModal() {
			this.exerciseModalVisible = false;
		},

		async handleExerciseSubmit() {
			this.exerciseSubmitLoading = true;
			try {
				const req = this.parseJson(this.exerciseReqJsonText, {});
				const payload = {
					req,
					audioFile: this.audioFile,
				};

				if (this.isEditExerciseMode) {
					await updateExercise(this.editingExerciseId, payload);
					this.$message.success("Cập nhật bài tập thành công");
				} else {
					await createExercise(payload);
					this.$message.success("Thêm bài tập thành công");
				}

				this.exerciseModalVisible = false;
				await this.fetchExercises();
			} catch (error) {
				this.$message.error(error?.message || "Không thể lưu bài tập");
			} finally {
				this.exerciseSubmitLoading = false;
			}
		},

		handleDeleteExercise(id) {
			this.$confirm({
				title: "Xác nhận xóa",
				content: "Bạn có chắc muốn xóa bài tập này không?",
				okText: "Xóa",
				okType: "danger",
				cancelText: "Hủy",
				onOk: async () => {
					try {
						await deleteExercise(id);
						this.$message.success("Xóa bài tập thành công");
						if (this.selectedExercise?.id === id) {
							this.selectedExercise = null;
							this.exerciseItems = [];
						}
						await this.fetchExercises();
					} catch (error) {
						this.$message.error("Không thể xóa bài tập");
					}
				},
			});
		},

		async openEditItemModal(id) {
			this.itemSubmitLoading = true;
			try {
				const res = await getExerciseItemById(id);
				const item = this.normalizeExerciseItem(this.extractObjectData(res) || {});
				this.editingItemId = id;
				this.itemJsonText = this.stringifyJson(item.raw || item);
				this.itemModalVisible = true;
			} catch (error) {
				this.$message.error("Không thể tải chi tiết item");
			} finally {
				this.itemSubmitLoading = false;
			}
		},

		closeItemModal() {
			this.itemModalVisible = false;
		},

		async handleItemSubmit() {
			this.itemSubmitLoading = true;
			try {
				const payload = this.parseJson(this.itemJsonText, {});
				await updateExerciseItem(this.editingItemId, payload);
				this.$message.success("Cập nhật exercise-item thành công");
				this.itemModalVisible = false;
				await this.fetchExerciseItems();
			} catch (error) {
				this.$message.error(error?.message || "Không thể cập nhật item");
			} finally {
				this.itemSubmitLoading = false;
			}
		},

		handleDeleteItem(id) {
			this.$confirm({
				title: "Xác nhận xóa",
				content: "Bạn có chắc muốn xóa item này không?",
				okText: "Xóa",
				okType: "danger",
				cancelText: "Hủy",
				onOk: async () => {
					try {
						await deleteExerciseItem(id);
						this.$message.success("Xóa exercise-item thành công");
						await this.fetchExerciseItems();
					} catch (error) {
						this.$message.error("Không thể xóa item");
					}
				},
			});
		},
	},
};
</script>

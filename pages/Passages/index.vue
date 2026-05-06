<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Quản lí đoạn đoc</h1>
				<p class="text-sm text-gray-500 mt-1">
					Danh sách các đoạn đọc dùng cho bài Reading trong hệ thống
				</p>
			</div>
			<div class="flex items-center gap-3">
				<a-input-search
					v-model="searchText"
					placeholder="Tìm theo tiêu đề hoặc nội dung"
					allow-clear
					style="width: 320px"
				/>
				<a-button type="primary" icon="plus" @click="openCreateModal">
					Thêm passage
				</a-button>
			</div>
		</div>

		<a-card :bordered="false" class="shadow-sm">
			<a-table
				:columns="columns"
				:data-source="filteredPassages"
				:loading="loading"
				:pagination="{ pageSize: 10, showSizeChanger: true }"
				row-key="id"
			>
				<template slot="stt" slot-scope="text, record, index">
					<span class="text-gray-500">{{ index + 1 }}</span>
				</template>

				

				<template slot="action" slot-scope="record">
					<TableActionButtons
						:show-view="true"
						delete-confirm-title="Bạn có chắc muốn xóa passage này?"
						@view="openDetailModal(record)"
						@edit="openEditModal(record)"
						@delete="handleDelete(record.id)"
					/>
				</template>
			</a-table>
		</a-card>

		<a-modal
			title="Chi tiết passage"
			:visible="detailModalVisible"
			:confirm-loading="detailLoading"
			:footer="null"
			width="820px"
			@cancel="closeDetailModal"
		>
			<div v-if="selectedPassage">
				<div class="mb-4">
					<div class="text-xs uppercase tracking-wide text-gray-400 mb-1">Tiêu đề</div>
					<div class="text-lg font-semibold text-gray-900">
						{{ selectedPassage.title || '-' }}
					</div>
				</div>

				<div class="mb-4 flex items-center gap-3">
					<a-tag color="blue">ID: {{ selectedPassage.id || '-' }}</a-tag>
					<a-tag color="geekblue">{{ getWordCount(selectedPassage.content) }} từ</a-tag>
				</div>

				<div>
					<div class="text-xs uppercase tracking-wide text-gray-400 mb-2">Nội dung</div>
					<div class="rounded-lg border bg-gray-50 p-4 max-h-[60vh] overflow-auto whitespace-pre-wrap leading-7 text-gray-700">
						{{ selectedPassage.content || '-' }}
					</div>
				</div>
			</div>
		</a-modal>

		<a-modal
			:title="isEditMode ? 'Chỉnh sửa passage' : 'Thêm passage'"
			:visible="modalVisible"
			:confirm-loading="submitLoading"
			:ok-text="isEditMode ? 'Cập nhật' : 'Tạo mới'"
			cancel-text="Hủy"
			width="760px"
			@ok="handleSubmit"
			@cancel="closeModal"
		>
			<a-form layout="vertical">
				<a-form-item label="Tiêu đề">
					<a-input v-model="form.title" placeholder="Nhập tiêu đề passage" :max-length="200" />
				</a-form-item>

				<a-form-item label="Nội dung passage">
					<a-textarea
						v-model="form.content"
						placeholder="Nhập nội dung bài đọc"
						:rows="12"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import { createPassage, deletePassage, getListPassage, getPassageById, updatePassage } from "@/apis/passages";
import TableActionButtons from "@/components/common/TableActionButtons.vue";

export default {
	name: "PassagesPage",
	layout: "admin",
	components: {
		TableActionButtons,
	},
	data() {
		return {
			passages: [],
			loading: false,
			submitLoading: false,
			modalVisible: false,
			detailModalVisible: false,
			detailLoading: false,
			isEditMode: false,
			editingId: null,
			selectedPassage: null,
			searchText: "",
			form: {
				title: "",
				content: "",
			},
			columns: [
				
				{ title: "ID", dataIndex: "id", width: 90, align: "center" },
				{ title: "Tiêu đề", dataIndex: "title", scopedSlots: { customRender: "title" } },
				{ title: "Nội dung", dataIndex: "content", scopedSlots: { customRender: "content" } },
				{ title: "Thao tác", scopedSlots: { customRender: "action" }, width: 120, align: "center" },
			],
		};
	},
	computed: {
		filteredPassages() {
			const keyword = (this.searchText || "").trim().toLowerCase();
			if (!keyword) return this.passages;

			return this.passages.filter((item) => {
				const title = String(item.title || "").toLowerCase();
				const content = String(item.content || "").toLowerCase();
				return title.includes(keyword) || content.includes(keyword);
			});
		},
	},
	async created() {
		await this.fetchPassages();
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

		normalizePassage(item) {
			return {
				...item,
				id: item?.id || item?._id || item?.passageId,
				title: item?.title || item?.name || item?.heading || "",
				content: item?.content || item?.passage || item?.text || item?.body || "",
			};
		},

		async fetchPassages() {
			this.loading = true;
			try {
				const res = await getListPassage();
				const rawPassages = this.extractListData(res);
				this.passages = rawPassages.map((item) => this.normalizePassage(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách passages!");
			} finally {
				this.loading = false;
			}
		},

		openCreateModal() {
			this.isEditMode = false;
			this.editingId = null;
			this.form = {
				title: "",
				content: "",
			};
			this.modalVisible = true;
		},

		openEditModal(record) {
			this.isEditMode = true;
			this.editingId = record?.id;
			this.form = {
				title: record?.title || "",
				content: record?.content || "",
			};
			this.modalVisible = true;
		},

		async openDetailModal(record) {
			const id = record?.id;
			if (!id) return;

			this.detailModalVisible = true;
			this.detailLoading = true;
			this.selectedPassage = this.normalizePassage(record || {});
			try {
				const res = await getPassageById(id);
				const passage = this.normalizePassage(this.extractObjectData(res) || {});
				this.selectedPassage = passage;
			} catch (error) {
				this.$message.error("Không thể tải chi tiết passage.");
			} finally {
				this.detailLoading = false;
			}
		},

		closeDetailModal() {
			this.detailModalVisible = false;
			this.selectedPassage = null;
		},

		closeModal() {
			this.modalVisible = false;
		},

		async handleSubmit() {
			if (!this.form.title || !this.form.content) {
				this.$message.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung passage.");
				return;
			}

			const payload = {
				title: this.form.title.trim(),
				content: this.form.content.trim(),
				passage: this.form.content.trim(),
				text: this.form.content.trim(),
			};

			this.submitLoading = true;
			try {
				if (this.isEditMode) {
					await updatePassage(this.editingId, payload);
					this.$message.success("Cập nhật passage thành công!");
				} else {
					await createPassage(payload);
					this.$message.success("Thêm passage thành công!");
				}

				this.modalVisible = false;
				await this.fetchPassages();
			} catch (error) {
				this.$message.error(
					this.isEditMode ? "Không thể cập nhật passage." : "Không thể thêm passage."
				);
			} finally {
				this.submitLoading = false;
			}
		},

		async handleDelete(id) {
			this.$confirm({
				title: "Xác nhận xóa",
				content: "Bạn có chắc muốn xóa passage này không?",
				okText: "Xóa",
				okType: "danger",
				cancelText: "Hủy",
				onOk: async () => {
					try {
						await deletePassage(id);
						this.$message.success("Xóa passage thành công!");
						await this.fetchPassages();
					} catch (error) {
						this.$message.error("Không thể xóa passage.");
					}
				},
			});
		},

		truncateText(text, maxLength) {
			const value = String(text || "");
			if (value.length <= maxLength) return value;
			return `${value.slice(0, maxLength).trim()}...`;
		},

		getWordCount(content) {
			const value = String(content || "").trim();
			if (!value) return 0;
			return value.split(/\s+/).filter(Boolean).length;
		},
	},
};
</script>
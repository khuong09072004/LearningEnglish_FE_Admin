<template>
	<div class="p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Quản lí người dùng</h1>
				<p class="text-sm text-gray-500 mt-1">Danh sách tất cả người dùng trong hệ thống</p>
			</div>
		</div>

		<div class="mb-4 flex items-center gap-3">
			<span class="text-sm text-gray-600">Lọc theo trạng thái:</span>
			<a-select
				:value="selectedStatus"
				placeholder="Tất cả trạng thái"
				style="width: 220px"
				allow-clear
				@change="handleStatusFilterChange"
			>
				<a-select-option value="active">Đang hoạt động</a-select-option>
				<a-select-option value="locked">Đã khóa</a-select-option>
			</a-select>
		</div>

		<a-card :bordered="false" class="shadow-sm">
			<a-table
				:columns="columns"
				:data-source="filteredUsers"
				:loading="loading"
				:pagination="{ pageSize: 10, showSizeChanger: true }"
				row-key="id"
			>
				<template slot="name" slot-scope="name, record">
					<span class="font-medium text-gray-800">{{ name || record.username || "-" }}</span>
				</template>

				<template slot="email" slot-scope="email">
					<span class="text-gray-700">{{ email || "-" }}</span>
				</template>

				<template slot="role" slot-scope="role">
					<a-tag color="geekblue">{{ role || "USER" }}</a-tag>
				</template>

				<template slot="status" slot-scope="status, record">
					<a-tag :color="record.isLocked ? 'red' : 'green'">
						{{ record.isLocked ? "Đã khóa" : "Đang hoạt động" }}
					</a-tag>
				</template>

				<template slot="action" slot-scope="record">
					<div class="flex items-center justify-center gap-3">
						<a-tooltip title="Xem chi tiết">
							<a-button
								type="link"
								icon="eye"
								class="text-blue-500 p-0"
								@click="openDetailModal(record.id)"
							/>
						</a-tooltip>

						<a-tooltip :title="record.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'">
							<a-popconfirm
								:title="
									record.isLocked
										? 'Bạn có chắc muốn mở khóa tài khoản này?'
										: 'Bạn có chắc muốn khóa tài khoản này?'
								"
								:ok-text="record.isLocked ? 'Mở khóa' : 'Khóa'"
								cancel-text="Hủy"
								@confirm="handleToggleStatus(record)"
							>
								<a-button
									type="link"
									:icon="record.isLocked ? 'unlock' : 'lock'"
									:class="record.isLocked ? 'text-green-600 p-0' : 'text-red-500 p-0'"
								/>
							</a-popconfirm>
						</a-tooltip>
					</div>
				</template>
			</a-table>
		</a-card>

		<a-modal
			title="Chi tiết người dùng"
			:visible="detailModalVisible"
			:footer="null"
			@cancel="closeDetailModal"
		>
			<a-descriptions bordered :column="1" size="small">
				<a-descriptions-item label="ID">{{ selectedUser.id || "-" }}</a-descriptions-item>
				<a-descriptions-item label="Tên">
					{{ selectedUser.name || selectedUser.fullName || selectedUser.username || "-" }}
				</a-descriptions-item>
				<a-descriptions-item label="Email">{{ selectedUser.email || "-" }}</a-descriptions-item>
				<a-descriptions-item label="Số điện thoại">
					{{ selectedUser.phone || selectedUser.phoneNumber || "-" }}
				</a-descriptions-item>
				<a-descriptions-item label="Vai trò">
					{{ selectedUser.role || "USER" }}
				</a-descriptions-item>
				<a-descriptions-item label="Trạng thái">
					<a-tag :color="selectedUser.isLocked ? 'red' : 'green'">
						{{ selectedUser.isLocked ? "Đã khóa" : "Đang hoạt động" }}
					</a-tag>
				</a-descriptions-item>
			</a-descriptions>
		</a-modal>
	</div>
</template>

<script>
import { getListUser, getUserById, updateUserStatus } from "@/apis/user";

export default {
	name: "UsersPage",
	layout: "admin",
	data() {
		return {
			users: [],
			loading: false,
			selectedStatus: undefined,
			detailModalVisible: false,
			selectedUser: {},
			columns: [
				{
					title: "ID",
					dataIndex: "id",
					width: 80,
					align: "center",
				},
				{
					title: "Tên",
					dataIndex: "name",
					scopedSlots: { customRender: "name" },
				},
				{
					title: "Email",
					dataIndex: "email",
					scopedSlots: { customRender: "email" },
				},
				{
					title: "Vai trò",
					dataIndex: "role",
					scopedSlots: { customRender: "role" },
					width: 120,
					align: "center",
				},
				{
					title: "Trạng thái",
					dataIndex: "status",
					scopedSlots: { customRender: "status" },
					width: 150,
					align: "center",
				},
				{
					title: "Thao tác",
					scopedSlots: { customRender: "action" },
					width: 140,
					align: "center",
				},
			],
		};
	},
	computed: {
		filteredUsers() {
			if (!this.selectedStatus) return this.users;

			if (this.selectedStatus === "active") {
				return this.users.filter((item) => !item.isLocked);
			}

			if (this.selectedStatus === "locked") {
				return this.users.filter((item) => item.isLocked);
			}

			return this.users;
		},
	},
	async created() {
		await this.fetchUsers();
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

		normalizeUser(item) {
			const statusValue = (item?.status || item?.accountStatus || "").toString().toLowerCase();
			const lockedByBoolean =
				item?.locked === true || item?.isLocked === true || item?.enabled === false;
			const lockedByStatus = ["locked", "inactive", "disabled", "blocked"].includes(statusValue);

			return {
				...item,
				id: item?.id,
				name: item?.name || item?.fullName || item?.username || "",
				email: item?.email || "",
				role: item?.role || item?.userRole || "USER",
				isLocked: lockedByBoolean || lockedByStatus,
			};
		},

		async fetchUsers() {
			this.loading = true;
			try {
				const res = await getListUser();
				const rawUsers = this.extractListData(res);
				this.users = rawUsers.map((item) => this.normalizeUser(item));
			} catch (error) {
				this.$message.error("Không thể tải danh sách người dùng!");
			} finally {
				this.loading = false;
			}
		},

		handleStatusFilterChange(value) {
			this.selectedStatus = value;
		},

		async openDetailModal(id) {
			this.loading = true;
			try {
				const res = await getUserById(id);
				this.selectedUser = this.normalizeUser(this.extractObjectData(res) || {});
				this.detailModalVisible = true;
			} catch (error) {
				this.$message.error("Không thể tải chi tiết người dùng!");
			} finally {
				this.loading = false;
			}
		},

		closeDetailModal() {
			this.detailModalVisible = false;
			this.selectedUser = {};
		},

		async handleToggleStatus(record) {
			const nextLocked = !record.isLocked;
			const nextStatus = nextLocked ? "LOCKED" : "ACTIVE";
			try {
				await updateUserStatus(record.id, { status: nextStatus });
				this.$message.success(nextLocked ? "Khóa tài khoản thành công!" : "Mở khóa tài khoản thành công!");
				await this.fetchUsers();

				if (this.detailModalVisible && this.selectedUser?.id === record.id) {
					this.selectedUser = {
						...this.selectedUser,
						isLocked: nextLocked,
					};
				}
			} catch (error) {
				this.$message.error("Không thể cập nhật trạng thái tài khoản.");
			}
		},
	},
};
</script>

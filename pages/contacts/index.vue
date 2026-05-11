<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lí liên hệ</h1>
        <p class="text-sm text-gray-500 mt-1">Danh sách tất cả liên hệ từ người dùng</p>
      </div>
    </div>

    <a-card :bordered="false" class="shadow-sm">
      <a-table
        :columns="columns"
        :data-source="contacts"
        :loading="loading"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        row-key="id"
      >
        <template slot="name" slot-scope="name, record">
          <span class="font-medium text-gray-800">{{ name || record.name || '-' }}</span>
        </template>

        <template slot="email" slot-scope="email">
          <span class="text-gray-700">{{ email || '-' }}</span>
        </template>

        <template slot="phone" slot-scope="phone">
          <span class="text-gray-700">{{ phone || '-' }}</span>
        </template>

        <template slot="message" slot-scope="message, record">
          <span class="text-gray-700">{{ (record.message || '').slice(0, 120) || '-' }}</span>
        </template>

        <template slot="createdAt" slot-scope="createdAt, record">
          <span class="text-gray-600">{{ formatDate(record.createdAt) }}</span>
        </template>

        <template slot="action" slot-scope="record">
          <div class="flex items-center justify-center gap-3">
            <a-tooltip title="Xem chi tiết">
              <a-button type="link" icon="eye" class="text-blue-500 p-0" @click="openDetailModal(record.id)" />
            </a-tooltip>

            <a-popconfirm
              title="Bạn có chắc muốn xóa liên hệ này?"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" icon="delete" class="text-red-500 p-0" />
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-card>

    <a-modal title="Chi tiết liên hệ" :visible="detailModalVisible" :footer="null" @cancel="closeDetailModal">
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item label="ID">{{ selectedContact.id || '-' }}</a-descriptions-item>
        <a-descriptions-item label="Tên">{{ selectedContact.name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="Email">{{ selectedContact.email || '-' }}</a-descriptions-item>
        <a-descriptions-item label="Số điện thoại">{{ selectedContact.phone || '-' }}</a-descriptions-item>
        <a-descriptions-item label="Nội dung">{{ selectedContact.message || '-' }}</a-descriptions-item>
        <a-descriptions-item label="Ngày gửi">{{ formatDate(selectedContact.createdAt) }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { getAllContacts, getContactById, deleteContact } from "@/apis/contact";

export default {
  name: "ContactsPage",
  layout: "admin",
  data() {
    return {
      contacts: [],
      loading: false,
      detailModalVisible: false,
      selectedContact: {},
      columns: [
        { title: "ID", dataIndex: "id", width: 80, align: "center" },
        { title: "Tên", dataIndex: "name", scopedSlots: { customRender: "name" } },
        { title: "Email", dataIndex: "email", scopedSlots: { customRender: "email" } },
        { title: "Số điện thoại", dataIndex: "phone", scopedSlots: { customRender: "phone" }, width: 160, align: "center" },
        { title: "Nội dung", dataIndex: "message", scopedSlots: { customRender: "message" } },
        { title: "Ngày gửi", dataIndex: "createdAt", scopedSlots: { customRender: "createdAt" }, width: 180, align: "center" },
        { title: "Thao tác", scopedSlots: { customRender: "action" }, width: 120, align: "center" },
      ],
    };
  },
  async created() {
    await this.fetchContacts();
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

    normalizeContact(item) {
      return {
        ...item,
        id: item?.id,
        name: item?.name || item?.fullName || "",
        email: item?.email || "",
        phone: item?.phone || item?.phoneNumber || "",
        message: item?.message || item?.content || item?.body || "",
        createdAt: item?.createdAt || item?.created_at || item?.submittedAt || "",
      };
    },

    formatDate(value) {
      if (!value) return "-";
      try {
        const d = new Date(value);
        return d.toLocaleString();
      } catch (e) {
        return String(value);
      }
    },

    async fetchContacts() {
      this.loading = true;
      try {
        const res = await getAllContacts();
        const raw = this.extractListData(res);
        this.contacts = raw.map((i) => this.normalizeContact(i));
      } catch (error) {
        this.$message.error("Không thể tải danh sách liên hệ!");
      } finally {
        this.loading = false;
      }
    },

    async openDetailModal(id) {
      this.loading = true;
      try {
        const res = await getContactById(id);
        this.selectedContact = this.normalizeContact(this.extractObjectData(res) || {});
        this.detailModalVisible = true;
      } catch (error) {
        this.$message.error("Không thể tải chi tiết liên hệ!");
      } finally {
        this.loading = false;
      }
    },

    closeDetailModal() {
      this.detailModalVisible = false;
      this.selectedContact = {};
    },

    async handleDelete(id) {
      try {
        await deleteContact(id);
        this.$message.success("Xóa liên hệ thành công!");
        await this.fetchContacts();
      } catch (error) {
        this.$message.error("Không thể xóa liên hệ.");
      }
    },
  },
};
</script>

<style scoped></style>

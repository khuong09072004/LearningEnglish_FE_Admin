<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 flex items-center mt-2">
          <a-icon type="home" class="mr-2" />
          Tổng quan hệ thống Learning English
        </p>
      </div>
      <div class="flex space-x-3">
        <a-button type="default" icon="reload" size="large" @click="fetchDashboardData" :loading="loading">
          Làm mới
        </a-button>
      </div>
    </div>

    <!-- Loading State -->
    <a-spin v-if="loading" size="large" class="flex justify-center py-12" />

    <div v-else>
      <!-- Stats Cards - Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Users Stats -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Users')">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Tổng người dùng</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.totalUsers || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <a-icon type="user" class="text-2xl text-blue-600" />
            </div>
          </div>
          <div class="flex items-center text-xs">
            <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <a-icon type="check-circle" class="mr-1" /> {{ dashboardData.activeUsers || 0 }} Hoạt động
            </span>
          </div>
        </div>

        <!-- Active Users -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Users')">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Người dùng khoá</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.lockedUsers || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <a-icon type="lock" class="text-2xl text-red-600" />
            </div>
          </div>
          <p class="text-xs text-gray-600">Cần xử lý</p>
        </div>

        <!-- Pending Users -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Users')">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Chờ kích hoạt</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.pendingUsers || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <a-icon type="clock-circle" class="text-2xl text-yellow-600" />
            </div>
          </div>
          <p class="text-xs text-gray-600">Chờ xác nhận</p>
        </div>

        <!-- Admin Users -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Users')">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Admin</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.adminUsers || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <a-icon type="crown" class="text-2xl text-purple-600" />
            </div>
          </div>
          <p class="text-xs text-gray-600">Quản trị viên</p>
        </div>
      </div>

      <!-- Content Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Levels -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Levels')">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-gray-900 font-semibold">Cấp độ</h4>
            <a-icon type="bar-chart" class="text-xl text-blue-600" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardData.totalLevels || 0 }}</p>
          <p class="text-xs text-gray-600 mt-2">Tổng cấp độ học tập</p>
        </div>

        <!-- Topics -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Topics')">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-gray-900 font-semibold">Chủ đề</h4>
            <a-icon type="folder" class="text-xl text-green-600" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardData.totalTopics || 0 }}</p>
          <p class="text-xs text-gray-600 mt-2">Chủ đề bài học</p>
        </div>

        <!-- Grammar -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Grammar')">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-gray-900 font-semibold">Ngữ pháp</h4>
            <a-icon type="file-text" class="text-xl text-yellow-600" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardData.totalGrammar || 0 }}</p>
          <p class="text-xs text-gray-600 mt-2">Bài học ngữ pháp</p>
        </div>

        <!-- Vocabularies -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Vocabulary')">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-gray-900 font-semibold">Từ vựng</h4>
            <a-icon type="book" class="text-xl text-purple-600" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardData.totalVocabularies || 0 }}</p>
          <p class="text-xs text-gray-600 mt-2">Từ vựng học tập</p>
        </div>

        <!-- Exercises -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/exercises')">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-gray-900 font-semibold">Bài tập</h4>
            <a-icon type="solution" class="text-xl text-red-600" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardData.totalExercises || 0 }}</p>
          <p class="text-xs text-gray-600 mt-2">Tổng bài tập</p>
        </div>

        <!-- Conversation Lessons -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer" @click="$router.push('/Conversation')">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-gray-900 font-semibold">Hội thoại</h4>
            <a-icon type="phone" class="text-xl text-cyan-600" />
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ dashboardData.totalConversationLessons || 0 }}</p>
          <p class="text-xs text-gray-600 mt-2">Bài học hội thoại</p>
        </div>
      </div>

      <!-- Conversation Sessions Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Total Sessions -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Phiên hội thoại</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.totalConversationSessions || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <a-icon type="team" class="text-2xl text-indigo-600" />
            </div>
          </div>
          <p class="text-xs text-gray-600">Tổng số phiên học</p>
        </div>

        <!-- Session Stats Details -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Đã hoàn thành</span>
              <span class="font-bold text-gray-900">{{ dashboardData.completedConversationSessions || 0 }}</span>
            </div>
            <a-progress :percent="computePercentage(dashboardData.completedConversationSessions, dashboardData.totalConversationSessions)" :stroke-color="{ '0%': '#10b981', '100%': '#059669' }" stroke-linecap="round" />
            
            <div class="flex justify-between items-center mt-4">
              <span class="text-sm text-gray-600">Đã học</span>
              <span class="font-bold text-gray-900">{{ dashboardData.learnedConversationSessions || 0 }}</span>
            </div>
            <a-progress :percent="computePercentage(dashboardData.learnedConversationSessions, dashboardData.totalConversationSessions)" :stroke-color="{ '0%': '#3b82f6', '100%': '#1d4ed8' }" stroke-linecap="round" />
          </div>
        </div>
      </div>

      <!-- Recent Registered Users Table -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Người dùng mới đăng ký</h3>
              <p class="text-sm text-gray-500 mt-1">{{ dashboardData.recentRegisteredUsersCount || 0 }} người dùng gần đây</p>
            </div>
            <a-input-search
              placeholder="Tìm kiếm người dùng..."
              style="width: 250px"
              class="rounded-lg"
            />
          </div>
        </div>
        
        <div class="p-6">
          <a-table
            :columns="columns"
            :data-source="dashboardData.recentRegisteredUsers || []"
            :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} người dùng` }"
            :row-key="record => record.id"
            class="modern-table"
          >
            <template slot="fullName" slot-scope="text, record">
              <div class="flex items-center">
                <a-avatar 
                  :size="32"
                  :src="record.avatar"
                  v-if="record.avatar"
                >
                </a-avatar>
                <a-avatar 
                  v-else
                  :style="{ backgroundColor: '#1890ff' }"
                  class="mr-3"
                >
                  {{ text.charAt(0).toUpperCase() }}
                </a-avatar>
                <div class="ml-3">
                  <p class="font-semibold text-gray-900">{{ text }}</p>
                </div>
              </div>
            </template>
            
            <template slot="email" slot-scope="text">
              <span class="text-sm text-gray-500">{{ text }}</span>
            </template>

            <template slot="role" slot-scope="text">
              <a-tag :color="text === 'ADMIN' ? 'red' : 'blue'" class="rounded-full">
                {{ text }}
              </a-tag>
            </template>
            
            <template slot="status" slot-scope="text">
              <a-tag :color="text === 'ACTIVE' ? 'green' : 'orange'" class="rounded-full">
                <a-icon :type="text === 'ACTIVE' ? 'check-circle' : 'clock-circle'" class="mr-1" />
                {{ text === 'ACTIVE' ? 'Hoạt động' : 'Chờ kích hoạt' }}
              </a-tag>
            </template>

            <template slot="levelCode" slot-scope="text">
              <span class="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
                {{ text || 'N/A' }}
              </span>
            </template>

            <template slot="createdAt" slot-scope="text">
              <span class="text-sm text-gray-600">{{ formatDate(text) }}</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getDashboardData } from '@/apis/dashboard'

export default {
  name: 'Dashboard',
  layout: 'admin',
  data() {
    return {
      loading: true,
      dashboardData: {
        totalUsers: 0,
        activeUsers: 0,
        lockedUsers: 0,
        pendingUsers: 0,
        adminUsers: 0,
        totalLevels: 0,
        totalTopics: 0,
        totalGrammar: 0,
        totalVocabularies: 0,
        totalExercises: 0,
        totalConversationLessons: 0,
        totalConversationSessions: 0,
        completedConversationSessions: 0,
        learnedConversationSessions: 0,
        recentRegisteredUsersCount: 0,
        recentRegisteredUsers: []
      },
      columns: [
        {
          title: 'Họ và tên',
          dataIndex: 'fullName',
          key: 'fullName',
          width: 200,
          scopedSlots: { customRender: 'fullName' }
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: 220,
          scopedSlots: { customRender: 'email' }
        },
        {
          title: 'Vai trò',
          dataIndex: 'role',
          key: 'role',
          width: 100,
          scopedSlots: { customRender: 'role' }
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          width: 120,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Cấp độ',
          dataIndex: 'levelCode',
          key: 'levelCode',
          width: 100,
          scopedSlots: { customRender: 'levelCode' }
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150,
          scopedSlots: { customRender: 'createdAt' }
        }
      ]
    }
  },
  
  mounted() {
    this.fetchDashboardData()
  },

  methods: {
    async fetchDashboardData() {
      try {
        this.loading = true
        const response = await getDashboardData()
        
        if (response && response.code === 200) {
          this.dashboardData = response.data
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        this.$message.error('Không thể tải dữ liệu dashboard')
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    computePercentage(current, total) {
      if (!total || total === 0) return 0
      return Math.round((current / total) * 100)
    }
  }
}
</script>

<style scoped>
/* Modern table styling */
.modern-table >>> .ant-table {
  font-size: 14px;
}

.modern-table >>> .ant-table-thead > tr > th {
  background: transparent;
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
}

.modern-table >>> .ant-table-tbody > tr {
  transition: background-color 0.2s;
}

.modern-table >>> .ant-table-tbody > tr:hover {
  background: #f9fafb;
}

.modern-table >>> .ant-table-tbody > tr > td {
  border-bottom: 1px solid #f3f4f6;
  padding: 16px;
}

.modern-table >>> .ant-pagination {
  margin-top: 16px;
}
</style>

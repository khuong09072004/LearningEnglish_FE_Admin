<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <div class="flex items-center gap-3">
        <a-button size="large" icon="calendar" class="rounded-md">
          Jan 20, 2024 - Feb 9, 2024
        </a-button>
        <a-button size="large" class="bg-black hover:bg-gray-800 text-white border-black">
          Download
        </a-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="rounded-lg border bg-white p-6 shadow-sm"
      >
        <div class="flex flex-col space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <a-icon :type="stat.icon" class="text-gray-400" />
          </div>
          
          <div class="space-y-1">
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
              <span class="flex items-center text-xs font-medium" :class="stat.trend > 0 ? 'text-emerald-600' : 'text-red-600'">
                <a-icon :type="stat.trend > 0 ? 'arrow-up' : 'arrow-down'" class="text-[10px] mr-0.5" />
                {{ stat.trendText }}
              </span>
            </div>
            <p class="text-xs text-gray-600 flex items-center gap-1">
              <a-icon :type="stat.statusIcon" class="text-[10px]" />
              {{ stat.description }}
            </p>
            <p class="text-xs text-gray-400">{{ stat.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Visitors Chart -->
    <div class="rounded-lg border bg-white shadow-sm">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Total Visitors</h3>
            <p class="text-sm text-gray-500 mt-1">Total for the last 3 months</p>
          </div>
          <div class="flex gap-2">
            <a-button 
              v-for="period in periods" 
              :key="period.value"
              :type="selectedPeriod === period.value ? 'default' : 'link'"
              size="small"
              :class="selectedPeriod === period.value ? 'bg-gray-100' : 'text-gray-600'"
              @click="selectedPeriod = period.value"
            >
              {{ period.label }}
            </a-button>
          </div>
        </div>
        
        <div class="relative">
          <!-- Chart Placeholder -->
          <div class="h-[400px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div class="text-center space-y-3">
              <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p class="text-sm font-medium text-gray-500">Chart visualization</p>
              <p class="text-xs text-gray-400">Desktop vs Mobile traffic</p>
            </div>
          </div>
          
          <!-- Legend -->
          <div class="flex items-center justify-center gap-6 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-900"></div>
              <span class="text-xs text-gray-600">desktop</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-400"></div>
              <span class="text-xs text-gray-600">mobile</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Recent Users Table -->
    <div class="rounded-lg border bg-white shadow-sm">
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Recent Users</h3>
            <p class="text-sm text-gray-500 mt-1">A list of users who recently joined.</p>
          </div>
          <a-input-search
            placeholder="Search users..."
            style="width: 250px"
          />
        </div>
      </div>
      
      <div class="p-6">
        <a-table
          :columns="columns"
          :data-source="recentUsers"
          :pagination="{ 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
          }"
          :row-key="record => record.id"
          class="modern-table"
        >
          <template slot="name" slot-scope="text, record">
            <div class="flex items-center gap-3">
              <a-avatar :style="{ backgroundColor: record.avatarColor }" :size="32">
                {{ text.charAt(0) }}
              </a-avatar>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ text }}</p>
              </div>
            </div>
          </template>
          
          <template slot="email" slot-scope="text">
            <span class="text-sm text-gray-500">{{ text }}</span>
          </template>
          
          <template slot="status" slot-scope="text">
            <span 
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="text === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ text === 'active' ? 'Active' : 'Pending' }}
            </span>
          </template>
          
          <template slot="action">
            <a-dropdown :trigger="['click']">
              <a-button type="link" size="small" class="text-gray-500">
                <a-icon type="more" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="view">
                  <a-icon type="eye" />
                  <span class="ml-2">View</span>
                </a-menu-item>
                <a-menu-item key="edit">
                  <a-icon type="edit" />
                  <span class="ml-2">Edit</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="delete" class="text-red-600">
                  <a-icon type="delete" />
                  <span class="ml-2">Delete</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-table>
      </div>
      
    </div>
  </div>
</template>
    <!-- Page Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600 flex items-center">
          <a-icon type="home" class="mr-2" />
          Tổng quan hệ thống Learn English
        </p>
      </div>
      <div class="flex space-x-3">
        <a-button type="default" icon="download" size="large">
          Xuất báo cáo
        </a-button>
        <a-button type="primary" icon="plus" size="large" class="bg-blue-600 border-blue-600 hover:bg-blue-700">
          Tạo mới
        </a-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        <!-- Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             :style="{ background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)` }">
        </div>
        
        <div class="relative p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{{ stat.title }}</p>
              <h3 class="text-3xl font-bold text-gray-900">{{ stat.value }}</h3>
            </div>
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg"
              :style="{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }"
            >
              <a-icon :type="stat.icon" class="text-3xl text-white" />
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="flex items-center px-2 py-1 rounded-full text-xs font-semibold"
                 :class="stat.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              <a-icon :type="stat.trend > 0 ? 'arrow-up' : 'arrow-down'" class="text-xs" />
              <span class="ml-1">{{ Math.abs(stat.trend) }}%</span>
            </div>
            <span class="text-xs text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mr-3">
                <a-icon type="bar-chart" class="text-white text-lg" />
              </div>
              <h3 class="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
            </div>
            <a-button type="link" class="text-blue-600">Xem tất cả</a-button>
          </div>
        </div>
        
        <div class="p-6">
          <a-timeline class="mt-2">
            <a-timeline-item 
              v-for="activity in recentActivities" 
              :key="activity.id" 
              :color="activity.color"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500 mt-1 flex items-center">
                    <a-icon type="clock-circle" class="mr-1" />
                    {{ activity.time }}
                  </p>
                </div>
                <a-tag :color="activity.color" class="rounded-full">{{ activity.tag }}</a-tag>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-transparent">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center mr-3">
              <a-icon type="fund" class="text-white text-lg" />
            </div>
            <h3 class="text-lg font-bold text-gray-900">Thống kê nhanh</h3>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-6">
            <div v-for="item in quickStats" :key="item.label">
              <div class="flex justify-between text-sm mb-2">
                <span class="font-medium text-gray-700">{{ item.label }}</span>
                <span class="font-bold text-gray-900">{{ item.value }}%</span>
              </div>
              <a-progress 
                :percent="item.value" 
                :status="item.status"
                :stroke-color="{
                  '0%': item.color,
                  '100%': item.colorEnd,
                }"
                stroke-linecap="round"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Users Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-transparent">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center mr-3">
              <a-icon type="team" class="text-white text-lg" />
            </div>
            <h3 class="text-lg font-bold text-gray-900">Người dùng mới</h3>
          </div>
          <a-input-search
            placeholder="Tìm kiếm người dùng..."
            style="width: 250px"
            class="rounded-lg"
          />
        </div>
      </div>
      
      <a-table
        :columns="columns"
        :data-source="recentUsers"
        :pagination="{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Tổng ${total} người dùng` }"
        :row-key="record => record.id"
        class="modern-table"
      >
        <template slot="name" slot-scope="text, record">
          <div class="flex items-center">
            <a-avatar :style="{ backgroundColor: record.avatarColor }" class="mr-3">
              {{ text.charAt(0) }}
            </a-avatar>
            <div>
              <p class="font-semibold text-gray-900">{{ text }}</p>
            </div>
          </div>
        </template>
        
        <template slot="status" slot-scope="text">
          <a-tag :color="text === 'active' ? 'green' : 'orange'" class="rounded-full px-3">
            <a-icon :type="text === 'active' ? 'check-circle' : 'clock-circle'" />
            {{ text === 'active' ? 'Hoạt động' : 'Chờ kích hoạt' }}
          </a-tag>
        </template>
        
        <template slot="action">
          <div class="flex space-x-2">
            <a-tooltip title="Xem chi tiết">
              <a-button type="link" icon="eye" size="small" class="text-blue-600" />
            </a-tooltip>
            <a-tooltip title="Chỉnh sửa">
              <a-button type="link" icon="edit" size="small" class="text-green-600" />
            </a-tooltip>
            <a-tooltip title="Xóa">
              <a-button type="link" icon="delete" size="small" class="text-red-600" />
            </a-tooltip>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>
      

<script>
export default {
  name: 'Dashboard',
  layout: 'admin',
  data() {
    return {
      selectedPeriod: 'last30days',
      periods: [
        { label: 'Last 3 months', value: 'last3months' },
        { label: 'Last 30 days', value: 'last30days' },
        { label: 'Last 7 days', value: 'last7days' }
      ],
      stats: [
        {
          title: 'Total Revenue',
          value: '$1,250.44',
          trend: 12.5,
          trendText: '+12.5%',
          icon: 'dollar-circle',
          statusIcon: 'rise',
          description: 'Trending up this month',
          subtitle: 'Visitors for the last 6 months'
        },
        {
          title: 'New Customers',
          value: '1,234',
          trend: -20,
          trendText: '-20%',
          icon: 'user-add',
          statusIcon: 'fall',
          description: 'Down 20% this period',
          subtitle: 'Acquisition needs attention'
        },
        {
          title: 'Active Accounts',
          value: '45,678',
          trend: 12.5,
          trendText: '+12.5%',
          icon: 'user',
          statusIcon: 'rise',
          description: 'Strong user retention',
          subtitle: 'Engagement exceed targets'
        },
        {
          title: 'Growth Rate',
          value: '4.5%',
          trend: 4.5,
          trendText: '+4.5%',
          icon: 'line-chart',
          statusIcon: 'rise',
          description: 'Steady performance increase',
          subtitle: 'Meets growth projections'
        }
      ],
      recentSales: [
        {
          id: 1,
          name: 'Olivia Martin',
          email: 'olivia.martin@email.com',
          amount: '+$1,999.00',
          color: '#3b82f6'
        },
        {
          id: 2,
          name: 'Jackson Lee',
          email: 'jackson.lee@email.com',
          amount: '+$39.00',
          color: '#8b5cf6'
        },
        {
          id: 3,
          name: 'Isabella Nguyen',
          email: 'isabella.nguyen@email.com',
          amount: '+$299.00',
          color: '#10b981'
        },
        {
          id: 4,
          name: 'William Kim',
          email: 'will@email.com',
          amount: '+$99.00',
          color: '#f59e0b'
        },
        {
          id: 5,
          name: 'Sofia Davis',
          email: 'sofia.davis@email.com',
          amount: '+$39.00',
          color: '#ef4444'
        }
      ],
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Date',
          dataIndex: 'registerDate',
          key: 'registerDate'
        },
        {
          title: '',
          key: 'action',
          width: 50,
          scopedSlots: { customRender: 'action' }
        }
      ],
      recentUsers: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          registerDate: 'Dec 31, 2025',
          status: 'active',
          avatarColor: '#3b82f6'
        },
        {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          registerDate: 'Dec 30, 2025',
          status: 'active',
          avatarColor: '#8b5cf6'
        },
        {
          id: 3,
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          registerDate: 'Dec 29, 2025',
          status: 'pending',
          avatarColor: '#10b981'
        },
        {
          id: 4,
          name: 'Phạm Thị D',
          email: 'phamthid@email.com',
          registerDate: 'Dec 28, 2025',
          status: 'active',
          avatarColor: '#f59e0b'
        },
        {
          id: 5,
          name: 'Hoàng Văn E',
          email: 'hoangvane@email.com',
          registerDate: 'Dec 27, 2025',
          status: 'pending',
          avatarColor: '#ef4444'
        },
        {
          id: 6,
          name: 'Đỗ Thị F',
          email: 'dothif@email.com',
          registerDate: 'Dec 26, 2025',
          status: 'active',
          avatarColor: '#06b6d4'
        },
        {
          id: 7,
          name: 'Vũ Văn G',
          email: 'vuvang@email.com',
          registerDate: 'Dec 25, 2025',
          status: 'active',
          avatarColor: '#ec4899'
        },
        {
          id: 8,
          name: 'Bùi Thị H',
          email: 'buithih@email.com',
          registerDate: 'Dec 24, 2025',
          status: 'pending',
          avatarColor: '#f97316'
        }
      ]
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

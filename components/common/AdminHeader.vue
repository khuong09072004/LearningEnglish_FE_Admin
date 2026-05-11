<template>
  <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6">
    <button
      @click="$emit('toggle-sidebar')"
      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      <a-icon type="menu" class="text-lg" />
    </button>

    <div class="flex-1 flex items-center justify-between">
      <!-- Search -->
      <div class="w-full max-w-md">
        <a-input-search
          placeholder="Search documentation..."
          size="large"
          class="rounded-lg"
        >
          <a-icon slot="prefix" type="search" class="text-gray-400" />
          <template slot="suffix">
            <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-xs text-gray-600">
              <span class="text-xs">Ctrl</span>K
            </kbd>
          </template>
        </a-input-search>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-2">
        

        <div class="h-6 w-px bg-gray-200"></div>

        <a-dropdown placement="bottomRight" :trigger="['click']">
          <a-avatar 
            src="https://github.com/shadcn.png" 
            :size="32"
            class="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all"
          />
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="profile">
              <a-icon type="user" />
              <span class="ml-2">Thông tin cá nhân</span>
            </a-menu-item>
            <a-menu-item key="settings">
              <a-icon type="setting" />
              <span class="ml-2">Cài đặt</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" class="text-red-600">
              <a-icon type="logout" />
              <span class="ml-2">Đăng xuất</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AdminHeader',
  methods: {
    handleMenuClick({ key }) {
      if (key === 'logout') {
        this.handleLogout()
      } else if (key === 'profile') {
        this.$message.info('Chức năng đang phát triển')
      } else if (key === 'settings') {
        this.$message.info('Chức năng đang phát triển')
      }
    },
    handleLogout() {
      this.$confirm({
        title: 'Xác nhận đăng xuất',
        content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        okText: 'Đăng xuất',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => {
          // Gọi store logout để xóa state và cookies
          this.$store.dispatch('auth/logout')
          
          this.$message.success('Đăng xuất thành công!')
          
          // Redirect về trang login
          setTimeout(() => {
            this.$router.push('/login')
          }, 500)
        }
      })
    }
  }
}
</script>

<style scoped>
/* Keyboard shortcut badge */
kbd {
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.05);
}
</style>

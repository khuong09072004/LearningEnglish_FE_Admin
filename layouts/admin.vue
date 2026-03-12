<template>
  <div class="flex min-h-screen bg-gray-50/50">
    <!-- Sidebar -->
    <AdminSidebar :collapsed="sidebarCollapsed" />

    <!-- Main Content -->
    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      ]"
    >
      <!-- Header -->
      <AdminHeader @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <nuxt />
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '~/components/common/AdminSidebar.vue'
import AdminHeader from '~/components/common/AdminHeader.vue'

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar,
    AdminHeader
  },
  data() {
    return {
      sidebarCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    }
  }
}
</script>

<style scoped>
/* Smooth transitions */
aside, main {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

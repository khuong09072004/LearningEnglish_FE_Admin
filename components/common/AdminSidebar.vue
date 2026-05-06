<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r bg-white',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- Logo & Company -->
    <div class="flex h-16 items-center border-b px-4">
      <transition name="fade" mode="out-in">
        <div v-if="!collapsed" key="full" class="flex items-center space-x-3">
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div>
            <h2 class="text-base font-semibold text-gray-900">Learn English</h2>
            <p class="text-xs text-gray-500">Enterprise</p>
          </div>
        </div>
        <div v-else key="collapsed" class="mx-auto">
          <svg
            class="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4">
      <!-- Trang chủ -->
      <div class="space-y-1 px-3">
        <nuxt-link
          to="/dashboard"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="home" class="text-base" />
          <span v-if="!collapsed">Trang chủ</span>
        </nuxt-link>
      </div>

      <!-- Quản lý hệ thống -->
      <div v-if="!collapsed" class="px-3 mb-2 mt-6">
        <p
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3"
        >
          Quản lý hệ thống
        </p>
      </div>
      <div class="space-y-1 px-3">
        <nuxt-link
          to="/users"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="team" class="text-base" />
          <span v-if="!collapsed">Quản lí người dùng</span>
        </nuxt-link>
      </div>

      <!-- Quản lý nội dung -->
      <div v-if="!collapsed" class="px-3 mb-2 mt-6">
        <p
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3"
        >
          Quản lý nội dung
        </p>
      </div>
      <div class="space-y-1 px-3">
        <nuxt-link
          to="/levels"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="trophy" class="text-base" />
          <span v-if="!collapsed">Quản lí cấp bậc</span>
        </nuxt-link>
        <nuxt-link
          to="/topics"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="book" class="text-base" />
          <span v-if="!collapsed">Quản lí chủ đề</span>
        </nuxt-link>

        <nuxt-link
          to="/Passages"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="file-text" class="text-base" />
          <span v-if="!collapsed">Quản lí đoạn đọc</span>
        </nuxt-link>

        <nuxt-link
          to="/Conversation"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="message" class="text-base" />
          <span v-if="!collapsed"> Quản lí hội thoại</span>
        </nuxt-link>

        <nuxt-link
          to="/vocabulary"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="font-size" class="text-base" />
          <span v-if="!collapsed">Quản lí từ vựng</span>
        </nuxt-link>

        <nuxt-link
          to="/grammar"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="read" class="text-base" />
          <span v-if="!collapsed"> Quản lí ngữ pháp</span>
        </nuxt-link>

        <nuxt-link
          to="/exercises"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="edit" class="text-base" />
          <span v-if="!collapsed"> Quản lí bài tập</span>
        </nuxt-link>
      </div>

      <!-- Hỗ trợ -->
      <div v-if="!collapsed" class="px-3 mb-2 mt-6">
        <p
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3"
        >
          Hỗ trợ
        </p>
      </div>
      <div class="space-y-1 px-3">
        <nuxt-link
          to="/contacts"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900"
          active-class="bg-gray-100 text-gray-900"
        >
          <a-icon type="message" class="text-base" />
          <span v-if="!collapsed"> Quản lí liên hệ</span>
        </nuxt-link>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>
    </nav>

    <!-- User Profile at Bottom -->
    <div class="border-t">
      <div class="p-3">
        <a-dropdown placement="topRight" :trigger="['click']">
          <div
            class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
          >
            <a-avatar
              src="https://github.com/shadcn.png"
              :size="32"
              class="flex-shrink-0"
            />
            <div v-if="!collapsed" class="flex-1 overflow-hidden">
              <p class="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p class="text-xs text-gray-500 truncate">
                admin@learnenglish.com
              </p>
            </div>
          </div>
        </a-dropdown>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "AdminSidebar",
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Keyboard shortcut badge */
kbd {
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.05);
}
</style>

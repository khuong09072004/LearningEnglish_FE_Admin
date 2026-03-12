export default ({ store }) => {
  // Khởi tạo auth state từ cookies khi app start
  store.dispatch('auth/initAuth')
}

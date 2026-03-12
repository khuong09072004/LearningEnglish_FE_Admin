export default function ({ store, redirect, route }) {
  // Danh sách các route không cần đăng nhập
  const publicPages = ['/login', '/register', '/forgot-password']
  
  // Kiểm tra nếu đang ở trang public thì không cần check auth
  if (publicPages.includes(route.path)) {
    return
  }

  const token = store.state.auth.token

  // Nếu chưa đăng nhập thì redirect về login
  if (!token) {
    return redirect('/login')
  }
}
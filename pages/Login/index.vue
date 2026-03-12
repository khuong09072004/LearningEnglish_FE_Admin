<template>
  <div class="min-h-screen bg-gray-100 relative overflow-hidden flex items-center justify-center p-5">
    <!-- Background decoration -->
    <div class="absolute w-full h-full overflow-hidden z-0">
      <div class="absolute rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-10 w-[400px] h-[400px] -top-[200px] -left-[200px] animate-float"></div>
      <div class="absolute rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-10 w-[300px] h-[300px] -bottom-[150px] -right-[150px] animate-float-delayed-7"></div>
      <div class="absolute rounded-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-10 w-[250px] h-[250px] top-1/2 right-[10%] animate-float-delayed-14"></div>
    </div>

    <div class="relative z-10 flex max-w-[1100px] w-full bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px]">
      <!-- Left side - Branding -->
      <div class="flex-1 bg-gradient-to-br from-blue-500 to-blue-700 p-[60px_50px] flex items-center justify-center relative overflow-hidden md:block hidden">
        <div class="absolute w-[300px] h-[300px] bg-white/10 rounded-full -top-[150px] -right-[150px]"></div>
        <div class="absolute w-[200px] h-[200px] bg-white/10 rounded-full -bottom-[100px] -left-[100px]"></div>
        
        <div class="relative z-10 text-white text-center">
          <a-icon type="rocket" class="text-[80px] mb-[30px] block animate-bounce-slow" />
          <h1 class="text-5xl font-extrabold mb-2.5 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">Learn English</h1>
          <p class="text-2xl font-light mb-[50px] opacity-95">Admin Portal</p>
          <div class="text-left max-w-[350px] mx-auto">
            <div class="flex items-center mb-5 text-base">
              <a-icon type="check-circle" class="text-xl mr-[15px]" />
              <span>Quản lý học viên hiệu quả</span>
            </div>
            <div class="flex items-center mb-5 text-base">
              <a-icon type="check-circle" class="text-xl mr-[15px]" />
              <span>Theo dõi tiến độ học tập</span>
            </div>
            <div class="flex items-center mb-5 text-base">
              <a-icon type="check-circle" class="text-xl mr-[15px]" />
              <span>Thống kê chi tiết</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - Login form -->
      <div class="flex-1 p-[60px_50px] flex items-center justify-center sm:p-[60px_50px] max-sm:p-[40px_30px]">
        <div class="w-full max-w-[400px]">
          <div class="mb-10 text-center">
            <h2 class="text-[32px] font-bold text-gray-800 mb-2.5 max-sm:text-[28px]">Đăng nhập</h2>
            <p class="text-[15px] text-gray-500">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <a-form :form="form" @submit="handleSubmit" class="mb-5">
            <a-form-item>
              <a-input
                v-decorator="[
                  'email',
                  {
                    rules: [
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]
                  }
                ]"
                size="large"
                placeholder="Email"
                type="email"
              >
                <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-input-password
                v-decorator="[ 
                  'password',
                  { 
                    rules: [{ required: true, message: 'Vui lòng nhập mật khẩu!' }]
                  }
                ]"
                size="large"
                placeholder="Mật khẩu"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              </a-input-password>
            </a-form-item>  

            <a-form-item>
              <div class="flex justify-between items-center">
                <a-checkbox v-decorator="['remember', { valuePropName: 'checked', initialValue: true }]">
                  Ghi nhớ đăng nhập
                </a-checkbox>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                class="h-12 text-base font-semibold bg-gradient-to-br from-blue-500 to-blue-600 border-none shadow-[0_4px_12px_rgba(24,144,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(24,144,255,0.4)] hover:from-blue-400 hover:to-blue-500"
                :loading="loading"
                block
              >
                Đăng nhập
              </a-button> 
            </a-form-item>
          </a-form>

         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '~/apis/auth'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  mounted() {
    // Lấy thông tin đã lưu nếu có
    const savedEmail = localStorage.getItem('savedEmail')
    const savedPassword = localStorage.getItem('savedPassword')
    
    if (savedEmail && savedPassword) {
      // Tự động điền vào form
      this.$nextTick(() => {
        this.form.setFieldsValue({
          email: savedEmail,
          password: savedPassword,
          remember: true
        })
      })
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true
          
          try {
            const body = {
              email: values.email,
              password: values.password
            }
            
            const response = await login(body)
            
            // Log response để debug
            console.log('Login response:', response)
            
            // Kiểm tra response có phải HTML không (lỗi cấu hình API)
            if (typeof response === 'string' && response.includes('<!doctype html>')) {
              throw new Error('Lỗi cấu hình API: Server trả về HTML thay vì JSON.')
            }
            
            // Kiểm tra response hợp lệ
            if (!response || !response.data) {
              throw new Error('Không nhận được dữ liệu từ server.')
            }
            
            // Kiểm tra status thành công
            if (response.status !== 'success' && response.code !== 200) {
              throw new Error(response.message || 'Đăng nhập thất bại')
            }
            
            // Kiểm tra có token không
            if (!response.data.token) {
              throw new Error('Không nhận được token xác thực từ server!')
            }
            
            // Lưu vào store
            await this.$store.dispatch('auth/login', response)
            
            // Xử lý "Ghi nhớ đăng nhập"
            if (values.remember) {
              // Lưu email và password để lần sau tự động điền
              localStorage.setItem('savedEmail', values.email)
              localStorage.setItem('savedPassword', values.password)
            } else {
              // Xóa thông tin đã lưu nếu không tick remember
              localStorage.removeItem('savedEmail')
              localStorage.removeItem('savedPassword')
            }
            
            this.$message.success(response.message || 'Đăng nhập thành công!')
            
            // Đợi 500ms trước khi redirect
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Redirect to dashboard
            this.$router.push('/dashboard')
            
          } catch (error) {
            console.error('Login error:', error)
            this.loading = false
            
            // Hiển thị thông báo lỗi chi tiết
            let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!'
            
            if (error.response?.data?.message) {
              // Lỗi từ API với message
              errorMessage = error.response.data.message
            } else if (error.response) {
              // Lỗi từ server khác
              errorMessage = `Lỗi server: ${error.response.status}`
            } else if (error.request) {
              // Request gửi nhưng không nhận response
              errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!'
            } else if (error.message) {
              // Lỗi khác có message
              errorMessage = error.message
            }
            
            this.$message.error(errorMessage)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 20s infinite ease-in-out;
}

.animate-float-delayed-7 {
  animation: float 20s infinite ease-in-out;
  animation-delay: 7s;
}

.animate-float-delayed-14 {
  animation: float 20s infinite ease-in-out;
  animation-delay: 14s;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
</style>

<template>
  <div class="landing-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="logo-animation">
          <a-icon type="rocket" class="main-icon" />
        </div>
        
        <h1 class="main-title">
          <span class="gradient-text">Learn English</span>
          <span class="subtitle">Admin Portal</span>
        </h1>
        
        <p class="description">
          Hệ thống quản lý học tiếng Anh hiện đại và chuyên nghiệp
        </p>

        <!-- CTA Button -->
        <div class="cta-section">
          <nuxt-link to="/login">
            <a-button type="primary" size="large" class="dashboard-btn">
              <a-icon type="login" />
              Đăng nhập
              <a-icon type="arrow-right" />
            </a-button>
          </nuxt-link>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <a-icon :type="feature.icon" />
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stat-item" v-for="(stat, index) in stats" :key="index">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2026 Learn English Admin. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted() {
    // Redirect to login page
    this.$router.push('/login')
  },
  data() {
    return {
      features: [
        {
          icon: 'user',
          title: 'Quản lý học viên',
          description: 'Theo dõi và quản lý thông tin học viên một cách dễ dàng'
        },
        {
          icon: 'book',
          title: 'Quản lý khóa học',
          description: 'Tạo và tùy chỉnh các khóa học tiếng Anh đa dạng'
        },
        {
          icon: 'bar-chart',
          title: 'Thống kê báo cáo',
          description: 'Phân tích dữ liệu và theo dõi tiến độ học tập'
        },
        {
          icon: 'setting',
          title: 'Cấu hình hệ thống',
          description: 'Tùy chỉnh và quản lý cài đặt hệ thống'
        }
      ],
      stats: [
        { number: '1000+', label: 'Học viên' },
        { number: '50+', label: 'Khóa học' },
        { number: '98%', label: 'Hài lòng' },
        { number: '24/7', label: 'Hỗ trợ' }
      ]
    }
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

/* Animated Background */
.animated-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  top: -250px;
  left: -250px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  bottom: -200px;
  right: -200px;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #69c0ff 0%, #40a9ff 100%);
  top: 50%;
  left: 50%;
  animation-delay: 14s;
}

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

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 80px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-animation {
  margin-bottom: 30px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.main-icon {
  font-size: 80px;
  color: #1890ff;
  filter: drop-shadow(0 10px 20px rgba(24, 144, 255, 0.3));
}

.main-title {
  margin-bottom: 20px;
  line-height: 1.2;
}

.gradient-text {
  display: block;
  font-size: 72px;
  font-weight: 800;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.subtitle {
  display: block;
  font-size: 32px;
  font-weight: 600;
  color: #595959;
  letter-spacing: 2px;
}

.description {
  font-size: 20px;
  color: #8c8c8c;
  margin-bottom: 40px;
  font-weight: 400;
}

/* CTA Section */
.cta-section {
  margin: 40px 0;
}

.dashboard-btn {
  height: 56px;
  padding: 0 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 28px;
  border: none;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  box-shadow: 0 10px 30px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
  color: #fff;
}

.dashboard-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(24, 144, 255, 0.5);
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  color: #fff;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
  animation: fadeInUp 1s ease-out 0.3s backwards;
}

.feature-card {
  background: #ffffff;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 2px solid #e8f4ff;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: #f0f9ff;
  box-shadow: 0 20px 40px rgba(24, 144, 255, 0.15);
  border-color: #1890ff;
}

.feature-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2);
  color: #096dd9;
}

.feature-card h3 {
  color: #262626;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
}

.feature-card p {
  color: #8c8c8c;
  font-size: 15px;
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  animation: fadeInUp 1s ease-out 0.6s backwards;
}

.stat-item {
  text-align: center;
  padding: 30px;
  background: #ffffff;
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 2px solid #e8f4ff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
}

.stat-item:hover {
  transform: scale(1.05);
  background: #f0f9ff;
  border-color: #1890ff;
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.15);
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 16px;
  color: #595959;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Footer */
.footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 30px 20px;
  color: #8c8c8c;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .gradient-text {
    font-size: 48px;
  }
  
  .subtitle {
    font-size: 24px;
  }
  
  .description {
    font-size: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .main-icon {
    font-size: 60px;
  }
}

@media (max-width: 480px) {
  .gradient-text {
    font-size: 36px;
  }
  
  .subtitle {
    font-size: 20px;
  }
  
  .stat-number {
    font-size: 36px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>

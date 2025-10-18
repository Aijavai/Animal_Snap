<template>
  <div class="profile-page">
    <!-- 顶部用户信息 -->
    <div class="user-header">
      <div class="user-avatar">
        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="用户头像" />
      </div>
      <div class="user-info">
        <h2>动物爱好者</h2>
        <p>探索世界的神奇动物</p>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ animalStats.totalAnimals || 0 }}</span>
            <span class="stat-label">已识别</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userStats.collectionsCreated || 0 }}</span>
            <span class="stat-label">收藏集</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ Math.round(animalStats.accuracy || 0) }}%</span>
            <span class="stat-label">准确率</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <h3>我的数据</h3>
        <div class="menu-items">
          <div class="menu-item" @click="goToCollection">
            <div class="menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9h6v6H9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 9h6v6H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 9h6v6h-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 15h6v6H9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">我的收藏</span>
              <span class="menu-subtitle">{{ animalStats.totalAnimals || 0 }} 只动物</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div class="menu-item" @click="exportData">
            <div class="menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">导出数据</span>
              <span class="menu-subtitle">备份我的动物收藏</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="menu-group">
        <h3>设置</h3>
        <div class="menu-items">
          <div class="menu-item" @click="toggleTheme">
            <div class="menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">主题设置</span>
              <span class="menu-subtitle">{{ userStore.currentTheme === 'dark' ? '深色模式' : '浅色模式' }}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div class="menu-item" @click="toggleNotifications">
            <div class="menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">通知设置</span>
              <span class="menu-subtitle">{{ userStore.settings.receiveNotifications ? '已开启' : '已关闭' }}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="menu-group">
        <h3>关于</h3>
        <div class="menu-items">
          <div class="menu-item" @click="showAbout">
            <div class="menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">关于应用</span>
              <span class="menu-subtitle">版本 1.0.0</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div class="menu-item" @click="clearData">
            <div class="menu-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">清除数据</span>
              <span class="menu-subtitle">删除所有本地数据</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'
import { useUserStore } from '../store/user'

const router = useRouter()
const animalStore = useAnimalStore()
const userStore = useUserStore()

// 计算属性
const animalStats = computed(() => animalStore.getAnimalStats())
const userStats = computed(() => userStore.userStats)

// 方法
const goToCollection = () => {
  router.push('/expert') // 临时跳转到专家页面，因为收藏页面已删除
}

const exportData = () => {
  const exportData = animalStore.exportAnimals()
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `animalsnap-backup-${new Date().toISOString().split('T')[0]}.json`
  link.click()
}

const toggleTheme = () => {
  userStore.toggleTheme()
}

const toggleNotifications = () => {
  userStore.toggleNotifications()
}

const showAbout = () => {
  alert('AnimalSnap v1.0.0\n一个智能动物识别应用\n帮助您探索世界的神奇动物')
}

const clearData = () => {
  if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
    animalStore.clearAllAnimals()
    alert('数据已清除')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 100px; /* 为底部导航留空间 */
}

.user-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.user-info p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 20px 0;
}

.user-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.menu-section {
  padding: 20px;
}

.menu-group {
  margin-bottom: 32px;
}

.menu-group h3 {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-items {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f3f4f6;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f9fafb;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.menu-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.menu-item svg:last-child {
  color: #9ca3af;
  flex-shrink: 0;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .user-header {
    padding: 30px 16px 20px;
    gap: 16px;
  }
  
  .user-avatar {
    width: 60px;
    height: 60px;
  }
  
  .user-info h2 {
    font-size: 20px;
  }
  
  .user-stats {
    gap: 16px;
  }
  
  .menu-section {
    padding: 16px;
  }
  
  .menu-item {
    padding: 14px 16px;
  }
}
</style>
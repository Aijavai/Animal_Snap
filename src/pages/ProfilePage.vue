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
          <div class="menu-item" @click="showThemeOptions = !showThemeOptions">
            <div class="menu-icon">
              <svg v-if="userStore.currentTheme === 'light'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else-if="userStore.currentTheme === 'dark'" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="menu-content">
              <span class="menu-title">主题设置</span>
              <span class="menu-subtitle">{{ themeLabel }}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :class="{ 'rotate-180': showThemeOptions }">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <!-- 主题选项下拉 -->
          <div v-if="showThemeOptions" class="theme-options">
            <div 
              class="theme-option"
              :class="{ active: userStore.currentTheme === 'light' }"
              @click="setTheme('light')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div class="theme-option-content">
                <span class="theme-option-title">浅色模式</span>
                <span class="theme-option-desc">适合白天使用</span>
              </div>
              <svg v-if="userStore.currentTheme === 'light'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <div 
              class="theme-option"
              :class="{ active: userStore.currentTheme === 'dark' }"
              @click="setTheme('dark')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="theme-option-content">
                <span class="theme-option-title">深色模式</span>
                <span class="theme-option-desc">适合夜间使用</span>
              </div>
              <svg v-if="userStore.currentTheme === 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <div 
              class="theme-option"
              :class="{ active: userStore.currentTheme === 'auto' }"
              @click="setTheme('auto')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M3 9h18M9 21V9" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div class="theme-option-content">
                <span class="theme-option-title">跟随系统</span>
                <span class="theme-option-desc">自动匹配系统设置</span>
              </div>
              <svg v-if="userStore.currentTheme === 'auto'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
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
              <span class="menu-subtitle">{{ userStore.settings.notifications ? '已开启' : '已关闭' }}</span>
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'
import { useUserStore } from '../store/user'
import { useNotificationStore } from '../store/notifications'

const router = useRouter()
const animalStore = useAnimalStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

// 状态
const showThemeOptions = ref(false)

// 计算属性
const animalStats = computed(() => animalStore.getAnimalStats())
const userStats = computed(() => userStore.userStats)

const themeLabel = computed(() => {
  const themeMap = {
    'light': '浅色模式',
    'dark': '深色模式',
    'auto': '跟随系统'
  }
  return themeMap[userStore.currentTheme] || '浅色模式'
})

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

const setTheme = (theme: 'light' | 'dark' | 'auto') => {
  userStore.updateSettings({ theme })
  showThemeOptions.value = false
}

const toggleNotifications = () => {
  userStore.toggleNotifications()
}

const showAbout = () => {
  alert('AnimalSnap v1.0.0\n一个智能动物识别应用\n帮助您探索世界的神奇动物')
}

const clearData = () => {
  if (confirm('确定要清除所有缓存数据吗？此操作不可恢复！\n\n将清除：\n- 所有识别的动物数据\n- 诊断历史记录\n- 通知消息\n- 用户设置（将恢复默认设置）')) {
    try {
      // 清除动物数据
      animalStore.clearAllAnimals()
      
      // 清除通知数据
      notificationStore.clearAll()
      
      // 清除诊断结果
      localStorage.removeItem('diagnosisResults')
      
      // 重置用户设置（但保留基本设置结构）
      userStore.resetSettings()
      
      // 清除所有相关的 localStorage 数据
      const keysToRemove = [
        'animalsnap-animals',
        'animalsnap-notifications',
        'animalsnap-user',
        'diagnosisResults'
      ]
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          console.warn(`清除 ${key} 失败:`, error)
        }
      })
      
      // 重新加载页面以确保状态同步
      alert('所有缓存数据已清除！')
      window.location.reload()
    } catch (error) {
      console.error('清除数据时出错:', error)
      alert('清除数据时出错，请重试')
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding-bottom: 100px;
}

.user-header {
  background: var(--color-bg-primary);
  padding: 24px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-border);
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
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.user-info p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
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
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.menu-section {
  padding: 16px;
}

.menu-group {
  margin-bottom: 24px;
}

.menu-group h3 {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin: 0 0 8px 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-items {
  background: var(--color-bg-primary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--color-border-light);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: var(--color-bg-secondary);
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.menu-icon svg {
  color: var(--color-secondary);
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.menu-subtitle {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.menu-item svg:last-child {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* 主题选项样式 */
.theme-options {
  padding: 8px;
  background: var(--color-bg-tertiary);
  border-top: 1px solid var(--color-border);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg-primary);
  border: 2px solid transparent;
}

.theme-option:last-child {
  margin-bottom: 0;
}

.theme-option:hover {
  background: var(--color-bg-secondary);
  transform: translateX(4px);
}

.theme-option.active {
  border-color: var(--color-accent);
  background: var(--color-bg-secondary);
}

.theme-option svg:first-child {
  color: var(--color-secondary);
  margin-right: 12px;
  flex-shrink: 0;
}

.theme-option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.theme-option-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.theme-option-desc {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.theme-option svg:last-child {
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
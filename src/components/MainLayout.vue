<template>
  <div class="main-layout">
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div class="nav-item" :class="{ active: activeTab === 'home' }" @click="goToPage('home')">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" :stroke="activeTab === 'home' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="9,22 9,12 15,12 15,22" :stroke="activeTab === 'home' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="nav-label">首页</span>
      </div>
      
      <div class="nav-item" :class="{ active: activeTab === 'diagnosis' }" @click="goToPage('diagnosis')">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" :stroke="activeTab === 'diagnosis' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" :stroke="activeTab === 'diagnosis' ? '#4F46E5' : '#6B7280'" stroke-width="2"/>
            <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" :stroke="activeTab === 'diagnosis' ? '#4F46E5' : '#6B7280'" stroke-width="2"/>
            <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" :stroke="activeTab === 'diagnosis' ? '#4F46E5' : '#6B7280'" stroke-width="2"/>
            <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" :stroke="activeTab === 'diagnosis' ? '#4F46E5' : '#6B7280'" stroke-width="2"/>
          </svg>
        </div>
        <span class="nav-label">诊断</span>
      </div>
      
      <!-- 拍照按钮 (中间，特殊样式) -->
      <div class="camera-tab" @click="goToPage('camera')">
        <div class="camera-button">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>
      
      <div class="nav-item" :class="{ active: activeTab === 'expert' }" @click="goToPage('expert')">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" :stroke="activeTab === 'expert' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" :stroke="activeTab === 'expert' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" :stroke="activeTab === 'expert' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h.5" :stroke="activeTab === 'expert' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="nav-label">专家</span>
      </div>
      
      <div class="nav-item" :class="{ active: activeTab === 'profile' }" @click="goToPage('profile')">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" :stroke="activeTab === 'profile' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" :stroke="activeTab === 'profile' ? '#4F46E5' : '#6B7280'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="nav-label">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前激活的标签页
const activeTab = ref('home')

// 路由到标签页的映射
const routeToTab = {
  '/': 'home',
  '/diagnosis': 'diagnosis',
  '/camera': 'camera',
  '/expert': 'expert',
  '/profile': 'profile'
}

// 标签页到路由的映射
const tabToRoute = {
  'home': '/',
  'diagnosis': '/diagnosis',
  'camera': '/camera',
  'expert': '/expert',
  'profile': '/profile'
}

// 监听路由变化，更新激活的标签页
watch(() => route.path, (newPath) => {
  const tab = routeToTab[newPath]
  if (tab) {
    activeTab.value = tab
  }
}, { immediate: true })

// 页面跳转处理
const goToPage = (tab) => {
  const path = tabToRoute[tab]
  if (path && path !== route.path) {
    router.push(path)
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 底部导航栏 */
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  min-width: 60px;
}

.nav-item:hover {
  background: #f3f4f6;
}

.nav-item.active {
  color: #4F46E5;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  color: inherit;
}

/* 拍照按钮特殊样式 */
.camera-tab {
  position: relative;
  z-index: 10;
  cursor: pointer;
}

.camera-button {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin: -8px auto 0;
  border: 3px solid white;
}

.camera-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.camera-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.6);
}

.camera-button:hover::before {
  opacity: 1;
}

.camera-button:active {
  transform: translateY(0) scale(0.95);
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.camera-button svg {
  color: white;
  transition: all 0.3s ease;
}

.camera-button:hover svg {
  transform: scale(1.1);
}

/* 拍照按钮脉冲动画 */
@keyframes camera-pulse {
  0% {
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
  }
  50% {
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.8), 0 0 0 10px rgba(79, 70, 229, 0.1);
  }
  100% {
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
  }
}

.camera-button {
  animation: camera-pulse 3s ease-in-out infinite;
}

.camera-button:hover {
  animation: none;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .camera-button {
    width: 56px;
    height: 56px;
    margin: -6px auto 0;
  }
  
  .camera-button svg {
    width: 28px;
    height: 28px;
  }
  
  .nav-item {
    min-width: 50px;
    padding: 6px 8px;
  }
  
  .nav-label {
    font-size: 11px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .main-layout {
    background: #0f172a;
  }
  
  .bottom-nav {
    background: #1e293b;
    border-top-color: #334155;
  }
  
  .nav-item:hover {
    background: #334155;
  }
}
</style>
<template>
  <div class="main-layout">
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部导航栏 -->
    <div v-if="showBottomNav" class="bottom-nav">
      <div class="nav-item" :class="{ active: activeTab === 'home' }" @click="goToPage('home')">
        <div class="nav-icon">
          <van-icon name="home-o" :color="activeTab === 'home' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'" size="22" />
        </div>
        <span class="nav-label">首页</span>
      </div>
      
      <div class="nav-item" :class="{ active: activeTab === 'diagnosis' }" @click="goToPage('diagnosis')">
        <div class="nav-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              :stroke="activeTab === 'diagnosis' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'"
              stroke-width="2"
              fill="none"
            />
            <path 
              d="M9 12l2 2 4-4" 
              :stroke="activeTab === 'diagnosis' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <span class="nav-label">诊断</span>
      </div>
      
      <!-- 拍照按钮 (中间，特殊样式) -->
      <div class="camera-tab" @click="goToPage('camera')">
        <div class="camera-button">
          <van-icon name="photograph" color="white" size="32" />
        </div>
      </div>
      
      <div class="nav-item" :class="{ active: activeTab === 'expert' }" @click="goToPage('expert')">
        <div class="nav-icon">
          <van-icon name="service" :color="activeTab === 'expert' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'" size="22" />
        </div>
        <span class="nav-label">专家</span>
      </div>
      
      <div class="nav-item" :class="{ active: activeTab === 'profile' }" @click="goToPage('profile')">
        <div class="nav-icon">
          <van-icon name="user-o" :color="activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'" size="22" />
        </div>
        <span class="nav-label">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前激活的标签页
const activeTab = ref('home')

// 是否显示底部导航栏
const showBottomNav = computed(() => {
  // 如果路由元信息中明确设置了 showNav: false，则隐藏导航栏
  // 默认显示导航栏
  return route.meta.showNav !== false
})

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
  // 精确匹配
  const tab = routeToTab[newPath]
  if (tab) {
    activeTab.value = tab
    return
  }
  
  // 模糊匹配：对于动态路由（如 /animal-detail/:id），检查路径前缀
  if (newPath.startsWith('/animal-detail')) {
    // 详情页保持当前标签状态或回到首页
    // 可以根据需要调整逻辑
    return
  }
  
  // 特殊页面（search, test 等）保持当前激活状态
  const specialPages = ['/test', '/search']
  if (specialPages.includes(newPath)) {
    return
  }
  
  // 如果是不在导航栏中的路由，重置为首页
  if (!tab && !newPath.startsWith('/animal-detail') && !specialPages.includes(newPath)) {
    activeTab.value = 'home'
  }
}, { immediate: true })

// 页面跳转处理
const goToPage = (tab) => {
  const path = tabToRoute[tab]
  if (path) {
    // 如果当前在详情页或其他页面，允许导航
    router.push(path)
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
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
  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
  padding: 10px 0;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  position: relative;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.nav-item:hover {
  opacity: 0.7;
}

.nav-item.active {
  color: var(--color-primary);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.nav-label {
  font-size: 11px;
  font-weight: 400;
  color: var(--color-text-tertiary);
  transition: all 0.2s ease;
}

.nav-item.active .nav-label {
  color: var(--color-primary);
  font-weight: 500;
}

/* 拍照按钮特殊样式 */
.camera-tab {
  position: relative;
  z-index: 10;
  cursor: pointer;
}

.camera-button {
  width: 56px;
  height: 56px;
  background: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
  position: relative;
  margin: -4px auto 0;
  border: none;
}

.camera-button::before {
  display: none;
}

.camera-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
  filter: brightness(1.1);
}

.camera-button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.camera-button .van-icon {
  color: white;
  transition: all 0.2s ease;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .camera-button {
    width: 52px;
    height: 52px;
  }
  
  .camera-button .van-icon {
    font-size: 26px;
  }
  
  .nav-item {
    min-width: 50px;
    padding: 6px 8px;
  }
  
  .nav-label {
    font-size: 10px;
  }
}

/* 主题已通过CSS变量处理，移除媒体查询 */
</style>
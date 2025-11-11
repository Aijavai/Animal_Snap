<template>
  <div id="app" :class="{ 'dark-theme': isDarkMode }">
    <MainLayout />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, computed } from 'vue'
import { useUserStore } from './store/user'
import MainLayout from './components/MainLayout.vue'

const userStore = useUserStore()

// 计算当前是否为深色模式
const isDarkMode = computed(() => userStore.isDarkMode)

// 应用主题到DOM
const applyTheme = (isDark: boolean) => {
  const root = document.documentElement
  
  if (isDark) {
    root.classList.add('dark-theme')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark-theme')
    root.setAttribute('data-theme', 'light')
  }
}

// 监听系统主题变化（当设置为auto时）
const watchSystemTheme = () => {
  if (userStore.settings.theme === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }
}

// 监听用户主题设置变化
watch(() => userStore.settings.theme, () => {
  applyTheme(isDarkMode.value)
  watchSystemTheme()
}, { immediate: true })

// 监听isDarkMode变化
watch(isDarkMode, (newValue) => {
  applyTheme(newValue)
}, { immediate: true })

onMounted(() => {
  applyTheme(isDarkMode.value)
  watchSystemTheme()
})
</script>

<style>
/* CSS 变量系统 */
:root {
  /* 浅色主题颜色 */
  --color-primary: #1F2937;
  --color-primary-light: #374151;
  --color-secondary: #6B7280;
  --color-accent: #4F46E5;
  
  /* 背景色 */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
  --color-bg-tertiary: #F3F4F6;
  
  /* 文本色 */
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  
  /* 边框色 */
  --color-border: #E5E7EB;
  --color-border-light: #F3F4F6;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* 其他 */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}

/* 深色主题 */
.dark-theme,
[data-theme='dark'] {
  /* 主色调 */
  --color-primary: #F9FAFB;
  --color-primary-light: #E5E7EB;
  --color-secondary: #9CA3AF;
  --color-accent: #6366F1;
  
  /* 背景色 */
  --color-bg-primary: #111827;
  --color-bg-secondary: #1F2937;
  --color-bg-tertiary: #374151;
  
  /* 文本色 */
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #D1D5DB;
  --color-text-tertiary: #9CA3AF;
  
  /* 边框色 */
  --color-border: #374151;
  --color-border-light: #4B5563;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.7);
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-secondary);
  transition: background-color 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-secondary);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

/* 按钮基础样式 */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.3s ease;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 输入框基础样式 */
input, select, textarea {
  font-family: inherit;
  outline: none;
  border: none;
  background: transparent;
}

/* 链接样式 */
a {
  color: inherit;
  text-decoration: none;
}

/* 图片样式 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .safe-area-top {
    padding-top: max(20px, env(safe-area-inset-top));
  }
  
  .safe-area-bottom {
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}

/* 过渡动画 */
* {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              color 0.3s ease,
              box-shadow 0.3s ease;
}
</style>
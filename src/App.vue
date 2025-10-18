<template>
  <div id="app">
    <MainLayout />
    <PerformanceMonitor />
  </div>
</template>

<script setup lang="ts">
import MainLayout from './components/MainLayout.vue'
import PerformanceMonitor from './components/PerformanceMonitor.vue'
</script>

<style>
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
  background: #f8fafc;
}

#app {
  height: 100%;
  overflow: hidden;
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
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  body {
    background: #0f172a;
    color: #f1f5f9;
  }
  
  #app {
    background: #0f172a;
  }
}
</style>
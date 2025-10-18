<template>
  <div v-if="showMonitor" class="performance-monitor">
    <div class="monitor-header">
      <h4>性能监控</h4>
      <button @click="toggleMonitor" class="close-btn">×</button>
    </div>
    <div class="monitor-content">
      <div class="metric">
        <span class="label">FPS:</span>
        <span class="value" :class="fpsClass">{{ fps }}</span>
      </div>
      <div class="metric">
        <span class="label">内存:</span>
        <span class="value">{{ memoryUsage }}MB</span>
      </div>
      <div class="metric">
        <span class="label">渲染时间:</span>
        <span class="value">{{ renderTime }}ms</span>
      </div>
      <div class="metric">
        <span class="label">组件数:</span>
        <span class="value">{{ componentCount }}</span>
      </div>
    </div>
  </div>
  <button v-else @click="toggleMonitor" class="monitor-toggle">
    📊
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const showMonitor = ref(false)
const fps = ref(0)
const memoryUsage = ref(0)
const renderTime = ref(0)
const componentCount = ref(0)

let frameCount = 0
let lastTime = performance.now()
let animationId = null

const fpsClass = computed(() => {
  if (fps.value >= 55) return 'good'
  if (fps.value >= 30) return 'warning'
  return 'bad'
})

const toggleMonitor = () => {
  showMonitor.value = !showMonitor.value
  if (showMonitor.value) {
    startMonitoring()
  } else {
    stopMonitoring()
  }
}

const startMonitoring = () => {
  const measurePerformance = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime - lastTime >= 1000) {
      fps.value = Math.round((frameCount * 1000) / (currentTime - lastTime))
      frameCount = 0
      lastTime = currentTime
      
      // 获取内存使用情况
      if ('memory' in performance) {
        const memory = performance.memory
        memoryUsage.value = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      }
      
      // 获取渲染时间
      const entries = performance.getEntriesByType('measure')
      const renderEntries = entries.filter(entry => entry.name.includes('render'))
      if (renderEntries.length > 0) {
        renderTime.value = Math.round(renderEntries[renderEntries.length - 1].duration)
      }
      
      // 估算组件数量
      componentCount.value = document.querySelectorAll('[data-v-]').length
    }
    
    animationId = requestAnimationFrame(measurePerformance)
  }
  
  animationId = requestAnimationFrame(measurePerformance)
}

const stopMonitoring = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
}

onMounted(() => {
  // 开发环境下默认显示监控器
  if (import.meta.env.DEV) {
    showMonitor.value = true
    startMonitoring()
  }
})

onUnmounted(() => {
  stopMonitoring()
})
</script>

<style scoped>
.performance-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  z-index: 9999;
  min-width: 200px;
  backdrop-filter: blur(10px);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
}

.monitor-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #ccc;
}

.value {
  font-weight: 600;
}

.value.good {
  color: #10B981;
}

.value.warning {
  color: #F59E0B;
}

.value.bad {
  color: #EF4444;
}

.monitor-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.monitor-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .performance-monitor {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .monitor-toggle {
    top: 10px;
    right: 10px;
  }
}
</style>
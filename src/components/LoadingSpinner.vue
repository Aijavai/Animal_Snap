<template>
  <div class="loading-spinner" :class="[`size-${size}`, `variant-${variant}`]">
    <div class="spinner" v-if="type === 'spinner'">
      <div class="spinner-ring"></div>
    </div>
    <div class="dots" v-else-if="type === 'dots'">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="pulse" v-else-if="type === 'pulse'">
      <div class="pulse-circle"></div>
    </div>
    <div class="skeleton" v-else-if="type === 'skeleton'">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line medium"></div>
    </div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  text?: string
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'spinner',
  size: 'medium',
  variant: 'primary',
  overlay: false
})

// 解构props
const { type, size, variant, text, overlay } = props
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

/* 尺寸变体 */
.size-small {
  gap: 8px;
}

.size-large {
  gap: 16px;
}

/* 颜色变体 */
.variant-primary {
  color: #4F46E5;
}

.variant-secondary {
  color: #6B7280;
}

.variant-success {
  color: #10B981;
}

.variant-warning {
  color: #F59E0B;
}

.variant-error {
  color: #EF4444;
}

/* 旋转加载器 */
.spinner {
  position: relative;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid currentColor;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.size-small .spinner-ring {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.size-large .spinner-ring {
  width: 56px;
  height: 56px;
  border-width: 4px;
}

/* 点状加载器 */
.dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dots span {
  width: 8px;
  height: 8px;
  background: currentColor;
  border-radius: 50%;
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

.size-small .dots span {
  width: 6px;
  height: 6px;
}

.size-large .dots span {
  width: 12px;
  height: 12px;
}

.dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.dots span:nth-child(2) {
  animation-delay: -0.16s;
}

/* 脉冲加载器 */
.pulse {
  position: relative;
}

.pulse-circle {
  width: 40px;
  height: 40px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse-scale 1.5s infinite ease-in-out;
}

.size-small .pulse-circle {
  width: 24px;
  height: 24px;
}

.size-large .pulse-circle {
  width: 56px;
  height: 56px;
}

/* 骨架屏 */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-line.medium {
  width: 80%;
}

.size-small .skeleton-line {
  height: 8px;
}

.size-large .skeleton-line {
  height: 16px;
}

/* 加载文本 */
.loading-text {
  font-size: 14px;
  font-weight: 500;
  color: currentColor;
  text-align: center;
}

.size-small .loading-text {
  font-size: 12px;
}

.size-large .loading-text {
  font-size: 16px;
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse-scale {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 覆盖层模式 */
.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.loading-spinner.overlay.dark {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}
</style>

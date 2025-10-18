<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div 
          class="modal-container" 
          :class="[`size-${size}`, `variant-${variant}`]"
          @click.stop
        >
          <!-- 头部 -->
          <div v-if="showHeader" class="modal-header">
            <h3 v-if="title" class="modal-title">{{ title }}</h3>
            <button 
              v-if="showCloseButton" 
              @click="close" 
              class="modal-close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <!-- 内容 -->
          <div class="modal-content">
            <slot></slot>
          </div>
          
          <!-- 底部 -->
          <div v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <button @click="close" class="btn-secondary">取消</button>
              <button @click="confirm" class="btn-primary">确认</button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  variant?: 'default' | 'centered' | 'bottom-sheet'
  showHeader?: boolean
  showFooter?: boolean
  showCloseButton?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  persistent?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'opened'): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'default',
  showHeader: true,
  showFooter: false,
  showCloseButton: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  persistent: false
})

const emit = defineEmits<Emits>()

// 解构props
const { 
  modelValue, 
  title, 
  size, 
  variant, 
  showHeader, 
  showFooter, 
  showCloseButton 
} = props

const isOpen = ref(modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  if (newValue) {
    emit('opened')
  } else {
    emit('closed')
  }
})

// 监听内部状态变化
watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
  if (!newValue) {
    emit('closed')
  }
})

// 关闭模态框
const close = () => {
  if (!props.persistent) {
    isOpen.value = false
    emit('close')
  }
}

// 确认操作
const confirm = () => {
  emit('confirm')
  close()
}

// 处理遮罩层点击
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    close()
  }
}

// 阻止背景滚动
const preventBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const restoreBodyScroll = () => {
  document.body.style.overflow = ''
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (isOpen.value) {
    preventBodyScroll()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  restoreBodyScroll()
})

// 监听打开状态变化
watch(isOpen, (newValue) => {
  if (newValue) {
    preventBodyScroll()
  } else {
    restoreBodyScroll()
  }
})

// 暴露方法
const open = () => {
  isOpen.value = true
  emit('opened')
}

defineExpose({
  open,
  close,
  confirm
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
}

/* 尺寸变体 */
.size-small {
  max-width: 400px;
}

.size-large {
  max-width: 700px;
}

.size-fullscreen {
  max-width: 95vw;
  max-height: 95vh;
  width: 95vw;
  height: 95vh;
}

/* 变体样式 */
.variant-centered .modal-container {
  margin: auto;
}

.variant-bottom-sheet {
  align-items: flex-end;
}

.variant-bottom-sheet .modal-container {
  border-radius: 20px 20px 0 0;
  max-height: 80vh;
  width: 100%;
  max-width: none;
}

/* 头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #F3F4F6;
  color: #374151;
}

/* 内容 */
.modal-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* 底部 */
.modal-footer {
  padding: 16px 24px 20px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: #4F46E5;
  color: white;
}

.btn-primary:hover {
  background: #3730A3;
}

.btn-secondary {
  background: #F3F4F6;
  color: #6B7280;
}

.btn-secondary:hover {
  background: #E5E7EB;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

.modal-enter-to .modal-container,
.modal-leave-from .modal-container {
  transform: scale(1) translateY(0);
}

/* 底部弹窗动画 */
.variant-bottom-sheet .modal-enter-from .modal-container,
.variant-bottom-sheet .modal-leave-to .modal-container {
  transform: translateY(100%);
}

.variant-bottom-sheet .modal-enter-to .modal-container,
.variant-bottom-sheet .modal-leave-from .modal-container {
  transform: translateY(0);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
  }
  
  .modal-container {
    border-radius: 0;
    max-height: 100vh;
    height: 100vh;
  }
  
  .variant-bottom-sheet .modal-container {
    border-radius: 20px 20px 0 0;
    height: auto;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 16px 20px 12px;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 12px 20px 16px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: #1F2937;
    color: #F9FAFB;
  }
  
  .modal-header {
    border-bottom-color: #374151;
  }
  
  .modal-title {
    color: #F9FAFB;
  }
  
  .modal-close {
    color: #9CA3AF;
  }
  
  .modal-close:hover {
    background: #374151;
    color: #D1D5DB;
  }
  
  .modal-footer {
    border-top-color: #374151;
  }
  
  .btn-secondary {
    background: #374151;
    color: #D1D5DB;
  }
  
  .btn-secondary:hover {
    background: #4B5563;
  }
}
</style>

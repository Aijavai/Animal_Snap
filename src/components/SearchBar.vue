<template>
  <div class="search-bar" :class="{ focused: isFocused }">
    <div class="search-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>
    <input
      ref="inputRef"
      v-model="searchQuery"
      :placeholder="placeholder"
      :readonly="readonly"
      :autofocus="autofocus"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.enter="handleSearch"
      @click="handleReadonlyClick"
      class="search-input"
    />
    <button 
      v-if="showVoiceButton"
      @click="handleVoiceSearch" 
      class="voice-button"
      :disabled="isVoiceSearching"
    >
      <svg v-if="!isVoiceSearching" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="2"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <div v-else class="voice-animation">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
    <button 
      v-if="searchQuery && showClearButton"
      @click="clearSearch" 
      class="clear-button"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce, throttle } from '../utils/performance'

interface Props {
  placeholder?: string
  showVoiceButton?: boolean
  showClearButton?: boolean
  debounceDelay?: number
  throttleDelay?: number
  modelValue?: string
  readonly?: boolean
  autofocus?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'voice-search'): void
  (e: 'clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  showVoiceButton: true,
  showClearButton: true,
  debounceDelay: 300,
  throttleDelay: 1000,
  modelValue: '',
  readonly: false,
  autofocus: false
})

const emit = defineEmits<Emits>()

// 解构props
const { placeholder, showVoiceButton, showClearButton, modelValue } = props

const inputRef = ref<HTMLInputElement>()
const searchQuery = ref(modelValue)
const isFocused = ref(false)
const isVoiceSearching = ref(false)

// 防抖搜索
const debouncedSearch = debounce((value: string) => {
  emit('search', value)
}, props.debounceDelay)

// 节流语音搜索
const throttledVoiceSearch = throttle(() => {
  emit('voice-search')
}, props.throttleDelay)

// 监听输入变化
const handleInput = () => {
  emit('update:modelValue', searchQuery.value)
  debouncedSearch(searchQuery.value)
}

// 处理搜索
const handleSearch = () => {
  emit('search', searchQuery.value)
}

// 处理焦点
const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

// 处理语音搜索
const handleVoiceSearch = () => {
  isVoiceSearching.value = true
  throttledVoiceSearch()
  
  // 模拟语音搜索结束
  setTimeout(() => {
    isVoiceSearching.value = false
  }, 2000)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// 处理只读输入框点击
const handleReadonlyClick = () => {
  if (props.readonly) {
    emit('focus')
  }
}

// 暴露方法
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
  transition: all 0.2s ease;
}

.search-bar.focused {
  border-color: #1F2937;
}

.search-icon {
  color: #6B7280;
  margin-right: 12px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1F2937;
  background: transparent;
  cursor: text;
}

.search-input[readonly] {
  cursor: pointer;
}

.search-input::placeholder {
  color: #9CA3AF;
}

.voice-button,
.clear-button {
  background: #1F2937;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 6px;
  flex-shrink: 0;
}

.voice-button:hover:not(:disabled),
.clear-button:hover {
  background: #374151;
}

.voice-button:disabled {
  background: #D1D5DB;
  cursor: not-allowed;
}

.clear-button {
  background: #6B7280;
}

.clear-button:hover {
  background: #4B5563;
}

/* 语音搜索动画 */
.voice-animation {
  display: flex;
  gap: 2px;
  align-items: center;
}

.voice-animation span {
  width: 4px;
  height: 12px;
  background: white;
  border-radius: 2px;
  animation: voice-wave 1.2s infinite ease-in-out;
}

.voice-animation span:nth-child(1) {
  animation-delay: -0.32s;
}

.voice-animation span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes voice-wave {
  0%, 80%, 100% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  40% {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .search-bar {
    padding: 10px 14px;
  }
  
  .search-input {
    font-size: 14px;
  }
  
  .voice-button,
  .clear-button {
    width: 32px;
    height: 32px;
  }
}
</style>

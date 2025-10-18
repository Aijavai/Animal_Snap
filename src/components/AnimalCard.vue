<template>
  <div 
    class="animal-card" 
    :class="{ 
      'is-favorite': isFavorite,
      'loading': isLoading,
      'error': hasError
    }"
    @click="handleClick"
  >
    <div class="card-image">
      <img 
        :src="imageUrl" 
        :alt="name"
        loading="lazy"
        decoding="async"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <div v-if="isLoading" class="image-loading">
        <div class="loading-spinner"></div>
      </div>
      <div v-if="hasError" class="image-error">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <button 
        v-if="showFavoriteButton"
        @click.stop="toggleFavorite"
        class="favorite-button"
        :class="{ active: isFavorite }"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            :fill="isFavorite ? '#EF4444' : 'none'"
            :stroke="isFavorite ? '#EF4444' : '#6B7280'"
            stroke-width="2"
          />
        </svg>
      </button>
      <div v-if="confidence" class="confidence-badge">
        {{ Math.round(confidence * 100) }}%
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ name }}</h3>
      <p v-if="species" class="card-species">{{ species }}</p>
      <p v-if="description" class="card-description">{{ description }}</p>
      <div v-if="showStats" class="card-stats">
        <div v-if="date" class="stat-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>{{ formatDate(date) }}</span>
        </div>
        <div v-if="habitat" class="stat-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>{{ habitat }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="showActions" class="card-actions">
      <button @click.stop="handleView" class="action-button primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
        查看详情
      </button>
      <button @click.stop="handleShare" class="action-button secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"/>
        </svg>
        分享
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { debounce } from '../utils/performance'

interface Props {
  id: string
  name: string
  imageUrl: string
  species?: string
  description?: string
  confidence?: number
  date?: string
  habitat?: string
  isFavorite?: boolean
  showFavoriteButton?: boolean
  showStats?: boolean
  showActions?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'click', id: string): void
  (e: 'favorite', id: string, isFavorite: boolean): void
  (e: 'view', id: string): void
  (e: 'share', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isFavorite: false,
  showFavoriteButton: true,
  showStats: true,
  showActions: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const isLoading = ref(true)
const hasError = ref(false)

// 解构props以便在模板中直接使用
const { 
  id, 
  name, 
  imageUrl, 
  species, 
  description, 
  confidence, 
  date, 
  habitat, 
  isFavorite, 
  showFavoriteButton, 
  showStats, 
  showActions 
} = props

// 防抖的收藏切换
const debouncedToggleFavorite = debounce((id: string, isFavorite: boolean) => {
  emit('favorite', id, isFavorite)
}, 300)

const handleClick = () => {
  emit('click', id)
}

const handleImageLoad = () => {
  isLoading.value = false
  hasError.value = false
}

const handleImageError = () => {
  isLoading.value = false
  hasError.value = true
}

const toggleFavorite = () => {
  const newFavoriteState = !isFavorite
  debouncedToggleFavorite(id, newFavoriteState)
}

const handleView = () => {
  emit('view', id)
}

const handleShare = () => {
  emit('share', id)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.animal-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.animal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.animal-card.loading {
  opacity: 0.7;
}

.animal-card.error {
  border: 2px solid #EF4444;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #F3F4F6;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.animal-card:hover .card-image img {
  transform: scale(1.05);
}

.image-loading,
.image-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6B7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #E5E7EB;
  border-top: 3px solid #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.favorite-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.favorite-button.active {
  background: rgba(239, 68, 68, 0.1);
}

.confidence-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.card-species {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 8px 0;
  font-style: italic;
}

.card-description {
  font-size: 13px;
  color: #6B7280;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6B7280;
}

.stat-item svg {
  flex-shrink: 0;
}

.card-actions {
  padding: 12px 16px;
  border-top: 1px solid #F3F4F6;
  display: flex;
  gap: 8px;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.primary {
  background: #4F46E5;
  color: white;
}

.action-button.primary:hover {
  background: #3730A3;
}

.action-button.secondary {
  background: #F3F4F6;
  color: #6B7280;
}

.action-button.secondary:hover {
  background: #E5E7EB;
}

/* 尺寸变体 */
.animal-card.size-small .card-image {
  height: 120px;
}

.animal-card.size-small .card-content {
  padding: 12px;
}

.animal-card.size-small .card-title {
  font-size: 14px;
}

.animal-card.size-large .card-image {
  height: 280px;
}

.animal-card.size-large .card-content {
  padding: 20px;
}

.animal-card.size-large .card-title {
  font-size: 18px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .card-image {
    height: 160px;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .card-actions {
    padding: 8px 12px;
  }
  
  .action-button {
    font-size: 11px;
    padding: 6px 8px;
  }
}
</style>

<template>
  <div class="animal-detail-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1>动物详情</h1>
      <button class="share-btn" @click="shareAnimal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">😞</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="btn-primary" @click="loadAnimal">重试</button>
    </div>

    <!-- 动物详情内容 -->
    <div v-else-if="animal" class="animal-content">
      <!-- 动物图片 -->
      <div class="animal-image-section">
        <img :src="animal.image" :alt="animal.name" class="animal-image" />
        <div class="image-overlay">
          <div class="confidence-badge">{{ animal.confidence }}%</div>
          <button class="favorite-btn" @click="toggleFavorite">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                    :fill="isFavorite ? '#ef4444' : 'none'" 
                    :stroke="isFavorite ? '#ef4444' : 'white'" 
                    stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 动物信息 -->
      <div class="animal-info">
        <div class="animal-header">
          <h2>{{ animal.name }}</h2>
          <div class="species-tag">{{ animal.species }}</div>
        </div>
        
        <p class="animal-description">{{ animal.description }}</p>
        
        <div class="animal-details">
          <div class="detail-item">
            <div class="detail-label">栖息地</div>
            <div class="detail-value">{{ animal.habitat }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">识别时间</div>
            <div class="detail-value">{{ formatDate(animal.date) }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">置信度</div>
            <div class="detail-value">{{ animal.confidence }}%</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn-secondary" @click="editAnimal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          编辑
        </button>
        <button class="btn-danger" @click="deleteAnimal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'

const route = useRoute()
const router = useRouter()
const animalStore = useAnimalStore()

// 状态
const loading = ref(true)
const error = ref('')
const animal = ref<any>(null)
const isFavorite = ref(false)

// 计算属性
const animalId = computed(() => route.params.id as string)

// 方法
const loadAnimal = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const foundAnimal = animalStore.getAnimalById(animalId.value)
    if (foundAnimal) {
      animal.value = foundAnimal
    } else {
      error.value = '动物信息不存在'
    }
  } catch (err) {
    error.value = '加载失败，请重试'
    console.error('加载动物详情失败:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const shareAnimal = () => {
  if (navigator.share && animal.value) {
    navigator.share({
      title: `发现动物：${animal.value.name}`,
      text: animal.value.description,
      url: window.location.href
    }).catch(err => {
      console.log('分享失败:', err)
      // 降级到复制链接
      copyToClipboard(window.location.href)
    })
  } else {
    // 降级到复制链接
    copyToClipboard(window.location.href)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 这里可以显示一个提示
    console.log('链接已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // 这里可以添加收藏逻辑
}

const editAnimal = () => {
  // 这里可以跳转到编辑页面
  console.log('编辑动物:', animal.value?.id)
}

const deleteAnimal = () => {
  if (confirm('确定要删除这只动物吗？')) {
    animalStore.removeAnimal(animalId.value)
    router.push('/collection')
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadAnimal()
})
</script>

<style scoped>
.animal-detail-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 100px; /* 为底部导航留空间 */
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn, .share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover, .share-btn:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

.page-header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.error-state p {
  color: #6b7280;
  margin: 0 0 24px 0;
}

.animal-content {
  background: white;
  margin: 16px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.animal-image-section {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.animal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.confidence-badge {
  background: rgba(79, 70, 229, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.favorite-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.animal-info {
  padding: 24px;
}

.animal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.animal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.species-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.animal-description {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.animal-details {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.btn-secondary, .btn-danger {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.btn-danger {
  background: #fef2f2;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fee2e2;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .page-header {
    padding: 12px 16px;
  }
  
  .animal-content {
    margin: 12px;
  }
  
  .animal-image-section {
    height: 250px;
  }
  
  .animal-info {
    padding: 20px;
  }
  
  .action-buttons {
    padding: 0 20px 20px;
  }
}
</style>

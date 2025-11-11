<template>
  <div class="plant-detail-page">
    <div v-if="plant" class="plant-detail">
      <div class="plant-image-section">
        <img :src="plant.image" :alt="plant.name" class="plant-image" />
        <div class="image-overlay">
          <button class="back-btn" @click="goBack">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="confidence-badge">{{ plant.confidence }}% 置信度</div>
        </div>
      </div>
      
      <div class="plant-content">
        <div class="plant-header">
          <h1>{{ plant.name }}</h1>
          <p class="plant-date">识别于 {{ formatDate(plant.date) }}</p>
        </div>
        
        <div class="plant-description">
          <h3>植物描述</h3>
          <p>{{ plant.description }}</p>
        </div>
        
        <div class="plant-info-grid">
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <h4>识别准确度</h4>
              <p>{{ plant.confidence }}%</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <h4>植物类型</h4>
              <p>观赏植物</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <h4>养护难度</h4>
              <p>中等</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 3h18v18H3zM9 9h6v6H9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="info-content">
              <h4>生长环境</h4>
              <p>室内/室外</p>
            </div>
          </div>
        </div>
        
        <div class="care-tips">
          <h3>养护小贴士</h3>
          <div class="tips-list">
            <div class="tip-item">
              <div class="tip-icon">💧</div>
              <div class="tip-content">
                <h4>浇水</h4>
                <p>保持土壤湿润，但避免积水</p>
              </div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">☀️</div>
              <div class="tip-content">
                <h4>光照</h4>
                <p>需要充足的散射光，避免直射</p>
              </div>
            </div>
            <div class="tip-item">
              <div class="tip-icon">🌡️</div>
              <div class="tip-content">
                <h4>温度</h4>
                <p>适宜温度 18-25°C</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn-secondary" @click="sharePlant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            分享
          </button>
          <button class="btn-primary" @click="identifyAgain">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="2"/>
            </svg>
            重新识别
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <h2>植物未找到</h2>
      <p>抱歉，找不到这个植物信息</p>
      <button class="btn-primary" @click="goBack">返回</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'

const route = useRoute()
const router = useRouter()
const animalStore = useAnimalStore()

const plant = ref<any>(null)

// 获取植物详情
onMounted(() => {
  const plantId = route.params.id as string
  plant.value = animalStore.getAnimalById(plantId)
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 格式化日期
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

// 分享植物
const sharePlant = () => {
  if (navigator.share) {
    navigator.share({
      title: `我识别了植物：${plant.value.name}`,
      text: `通过AnimalSnap识别了植物：${plant.value.name}`,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('链接已复制到剪贴板')
    })
  }
}

// 重新识别
const identifyAgain = () => {
  router.push('/camera')
}
</script>

<style scoped>
.plant-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.plant-detail {
  background: #fff;
  min-height: 100vh;
}

.plant-image-section {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.plant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

.confidence-badge {
  background: rgba(76, 175, 80, 0.9);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.plant-content {
  padding: 30px 20px;
}

.plant-header {
  text-align: center;
  margin-bottom: 30px;
}

.plant-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #333;
}

.plant-date {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.plant-description {
  margin-bottom: 30px;
}

.plant-description h3 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #333;
}

.plant-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.plant-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #4CAF50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.info-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.info-content p {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.care-tips {
  margin-bottom: 30px;
}

.care-tips h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tip-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.tip-icon {
  font-size: 24px;
  margin-right: 15px;
}

.tip-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.tip-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4CAF50;
  color: #fff;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found h2 {
  margin: 0 0 15px 0;
  font-size: 24px;
  color: #333;
}

.not-found p {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 16px;
}

@media (max-width: 768px) {
  .plant-content {
    padding: 20px 15px;
  }
  
  .plant-header h1 {
    font-size: 24px;
  }
  
  .plant-info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>

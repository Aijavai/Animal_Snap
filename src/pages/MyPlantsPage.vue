<template>
  <div class="my-plants-page">
    <div class="page-header">
      <h1>我的植物</h1>
      <p class="plant-count">已识别 {{ plantStore.plants.length }} 种植物</p>
    </div>
    
    <div v-if="plantStore.plants.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>还没有识别过植物</h3>
      <p>点击下方相机按钮开始识别植物吧！</p>
      <button class="start-btn" @click="goToCamera">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="2"/>
        </svg>
        开始识别
      </button>
    </div>
    
    <div v-else class="plants-grid">
      <div 
        v-for="plant in plantStore.plants" 
        :key="plant.id"
        class="plant-card"
        @click="viewPlantDetail(plant)"
      >
        <div class="plant-image">
          <img :src="plant.image" :alt="plant.name" />
          <div class="confidence-badge">{{ plant.confidence }}%</div>
        </div>
        <div class="plant-info">
          <h3>{{ plant.name }}</h3>
          <p class="plant-date">{{ formatDate(plant.date) }}</p>
        </div>
        <button class="delete-btn" @click.stop="deletePlant(plant.id)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0v14m8-14v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'

const router = useRouter()
const animalStore = useAnimalStore()

// 查看植物详情
const viewPlantDetail = (plant: any) => {
  router.push(`/plant-detail/${plant.id}`)
}

// 删除植物
const deletePlant = (plantId: string) => {
  if (confirm('确定要删除这个植物吗？')) {
    plantStore.removePlant(plantId)
  }
}

// 跳转到相机页面
const goToCamera = () => {
  router.push('/camera')
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.my-plants-page {
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.plant-count {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #666;
}

.empty-state p {
  margin: 0 0 30px 0;
  color: #999;
  font-size: 16px;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.plant-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.plant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.plant-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.confidence-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(76, 175, 80, 0.9);
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.plant-info {
  padding: 16px;
}

.plant-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.plant-date {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.delete-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
}

.plant-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #ff4444;
  color: #fff;
}

@media (max-width: 768px) {
  .plants-grid {
    grid-template-columns: 1fr;
  }
  
  .my-plants-page {
    padding: 15px;
  }
}
</style>

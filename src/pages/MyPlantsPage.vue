<template>
  <div class="my-plants-page">
    <div class="page-header">
      <h1>我的植物</h1>
      <p class="plant-count">已识别 {{ animalStore.animals.length }} 种动物</p>
    </div>
    
    <div v-if="animalStore.animals.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>还没有识别过动物</h3>
      <p>点击下方相机按钮开始识别动物吧！</p>
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
        v-for="plant in animalStore.animals" 
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
  if (confirm('确定要删除这个动物吗？')) {
    animalStore.removeAnimal(plantId)
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
  background: var(--color-bg-secondary);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: var(--color-text-primary);
}

.plant-count {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  color: var(--color-text-tertiary);
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: var(--color-text-secondary);
}

.empty-state p {
  margin: 0 0 30px 0;
  color: var(--color-text-tertiary);
  font-size: 16px;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-success);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  background: var(--color-primary);
  transform: translateY(-2px);
}

.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.plant-card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  position: relative;
}

.plant-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
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
  background: var(--color-success);
  color: var(--color-bg-primary);
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
  color: var(--color-text-primary);
}

.plant-date {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.delete-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-primary);
  border: none;
  color: var(--color-text-secondary);
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
  background: var(--color-error);
  color: var(--color-bg-primary);
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

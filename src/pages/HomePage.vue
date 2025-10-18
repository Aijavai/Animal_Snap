<template>
  <div class="home-page">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="greeting">
          <h1>你好，动物探索者！</h1>
          <p>发现并记录世界各地的神奇动物</p>
        </div>
        <div class="weather-info">
          <div class="weather-icon">🌤️</div>
          <div class="weather-text">
            <span class="temperature">22°C</span>
            <span class="location">北京</span>
          </div>
        </div>
      </div>
      
      <!-- 搜索栏 -->
      <div class="search-container">
        <SearchBar
          v-model="searchQuery"
          placeholder="搜索动物、栖息地..."
          @search="handleSearch"
          @voice-search="startVoiceSearch"
        />
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <div class="action-card primary" @click="goToCamera">
        <div class="action-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="action-content">
          <h3>拍照识别</h3>
          <p>AI 智能识别动物种类</p>
        </div>
        <div class="action-arrow">→</div>
      </div>
      
      <div class="action-grid">
        <div class="action-card secondary" @click="goToDiagnosis">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="#10B981" stroke-width="2"/>
              <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="#10B981" stroke-width="2"/>
              <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="#10B981" stroke-width="2"/>
              <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="#10B981" stroke-width="2"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>诊断</h4>
            <p>健康诊断</p>
          </div>
        </div>
        
        <div class="action-card secondary" @click="goToExpert">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h.5" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>专家</h4>
            <p>咨询专家</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计仪表板 -->
    <div class="stats-dashboard">
      <h2>我的数据</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📸</div>
          <div class="stat-content">
            <h3>{{ animalStats.totalAnimals }}</h3>
            <p>已识别动物</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <h3>{{ animalStats.favoriteCount }}</h3>
            <p>收藏数量</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>{{ animalStats.accuracy }}%</h3>
            <p>识别准确率</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>{{ animalStats.thisWeek }}</h3>
            <p>本周识别</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近动物 -->
    <div class="recent-animals">
      <div class="section-header">
        <h2>最近识别</h2>
        <button class="view-all-btn" @click="goToCamera">查看全部</button>
      </div>
      <div class="animals-grid">
        <AnimalCard
          v-for="animal in recentAnimals"
          :key="animal.id"
          :id="animal.id"
          :name="animal.name"
          :image-url="animal.image"
          :species="animal.species"
          :confidence="animal.confidence"
          :date="animal.date"
          :is-favorite="favorites.includes(animal.id)"
          size="small"
          @click="viewAnimalDetail"
          @favorite="toggleFavorite"
        />
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="bottom-tip">
      <div class="tip-content">
        <h3>开始你的动物探索之旅</h3>
        <p>拍照识别动物，建立你的专属收藏</p>
        <button class="btn-primary" @click="goToCamera">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
          开始识别
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'
import { debounce, throttle, performanceMonitor } from '../utils/performance'
import SearchBar from '../components/SearchBar.vue'
import AnimalCard from '../components/AnimalCard.vue'

const router = useRouter()
const animalStore = useAnimalStore()

const searchQuery = ref('')
const favorites = ref([])

// 计算属性
const animalStats = computed(() => animalStore.getAnimalStats())
const recentAnimals = computed(() => animalStore.recentAnimals)

// 防抖搜索
const debouncedSearch = debounce((query) => {
  if (query.trim()) {
    performanceMonitor.mark('search-start')
    console.log('搜索:', query)
    // 这里可以添加实际的搜索逻辑
    performanceMonitor.measure('search-duration', 'search-start')
  }
}, 300)

// 节流语音搜索
const throttledVoiceSearch = throttle(() => {
  console.log('开始语音搜索')
  // 这里可以添加语音搜索逻辑
}, 1000)

// 方法
const handleSearch = (query) => {
  debouncedSearch(query)
}

const startVoiceSearch = () => {
  throttledVoiceSearch()
}

const toggleFavorite = (animalId, isFavorite) => {
  const index = favorites.value.indexOf(animalId)
  if (isFavorite && index === -1) {
    favorites.value.push(animalId)
  } else if (!isFavorite && index > -1) {
    favorites.value.splice(index, 1)
  }
}

const goToCamera = () => {
  router.push('/camera')
}

const goToDiagnosis = () => {
  router.push('/diagnosis')
}

const goToExpert = () => {
  router.push('/expert')
}

const viewAnimalDetail = (id) => {
  router.push(`/animal-detail/${id}`)
}

onMounted(() => {
  performanceMonitor.mark('home-page-mounted')
  animalStore.loadAnimals()
  favorites.value = ['animal-1', 'animal-3']
  performanceMonitor.measure('home-page-load', 'home-page-mounted')
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 16px;
  padding-bottom: 100px;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 30px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.greeting h1 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.greeting p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.weather-icon {
  font-size: 20px;
}

.weather-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.temperature {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.location {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* 搜索栏 */
.search-container {
  margin-bottom: 20px;
}

/* 快速操作 */
.quick-actions {
  margin-bottom: 30px;
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.action-card.primary {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-card.secondary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.action-card.secondary .action-icon {
  background: #F3F4F6;
  width: 40px;
  height: 40px;
}

.action-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.action-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 2px;
}

.action-content p {
  font-size: 14px;
  opacity: 0.8;
}

.action-arrow {
  font-size: 20px;
  margin-left: auto;
}

/* 统计仪表板 */
.stats-dashboard {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stats-dashboard h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #F8FAFC;
  border-radius: 12px;
}

.stat-icon {
  font-size: 24px;
}

.stat-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 2px;
}

.stat-content p {
  font-size: 12px;
  color: #6B7280;
}

/* 最近动物 */
.recent-animals {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 30px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
}

.view-all-btn {
  background: none;
  border: none;
  color: #4F46E5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 底部提示 */
.bottom-tip {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.tip-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}

.tip-content p {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .home-page {
    padding: 16px 12px;
  }
  
  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .animals-grid {
    grid-template-columns: 1fr;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>
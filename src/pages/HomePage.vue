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
          ref="searchBarRef"
          v-model="searchQuery"
          placeholder="搜索动物、栖息地..."
          @search="handleSearch"
          @voice-search="startVoiceSearch"
          @focus="goToSearchPage"
          @clear="handleSearchClear"
          readonly
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
          <div class="action-icon diagnosis-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" stroke-width="2"/>
              <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="action-content">
            <h4>诊断</h4>
            <p>健康诊断</p>
          </div>
        </div>
        
        <div class="action-card secondary" @click="goToExpert">
          <div class="action-icon expert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

    <!-- 搜索结果 -->
    <div v-if="isSearching && searchQuery.trim()" class="search-results">
      <div class="section-header">
        <h2>搜索结果</h2>
        <span class="result-count">{{ searchResults.length }} 个结果</span>
      </div>
      <div v-if="searchResults.length > 0" class="animals-grid">
        <AnimalCard
          v-for="animal in searchResults"
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
      <div v-else class="empty-search">
        <div class="empty-icon">🔍</div>
        <h3>未找到相关动物</h3>
        <p>试试其他关键词或使用拍照识别功能</p>
        <button class="btn-primary" @click="goToCamera">开始拍照识别</button>
      </div>
    </div>

    <!-- 最近动物 -->
    <div v-else class="recent-animals">
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

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'
import { debounce, throttle } from '../utils/performance'
import SearchBar from '../components/SearchBar.vue'
import AnimalCard from '../components/AnimalCard.vue'

const router = useRouter()
const animalStore = useAnimalStore()

const searchQuery = ref<string>('')
const favorites = ref<string[]>([])
const showSearchSuggestions = ref<boolean>(false)
const searchBarRef = ref<any>(null)

// 搜索相关
const isSearching = computed(() => {
  try {
    return searchQuery.value && searchQuery.value.trim().length > 0
  } catch {
    return false
  }
})

const searchResults = computed(() => {
  try {
    if (!searchQuery.value || !searchQuery.value.trim()) return []
    return animalStore.searchAnimals(searchQuery.value) || []
  } catch (error) {
    console.error('搜索失败:', error)
    return []
  }
})

// 热门搜索
const hotSearches = ref<string[]>([
  '金毛犬',
  '橘猫',
  '哈士奇',
  '鸟类',
  '鱼类'
])

// 搜索历史
const searchHistory = ref<string[]>([])

// 搜索建议（基于输入内容）
// @ts-expect-error - 预留功能
const searchSuggestions = computed<string[]>(() => {
  try {
    if (!searchQuery.value || !searchQuery.value.trim()) return []
    
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return []
    
    const suggestions = new Set<string>()
    
    // 从所有动物中提取可能的建议
    try {
      if (animalStore.animals && Array.isArray(animalStore.animals) && animalStore.animals.length > 0) {
        animalStore.animals.forEach(animal => {
          try {
            if (animal && animal.name && typeof animal.name === 'string' && animal.name.toLowerCase().includes(query)) {
              suggestions.add(animal.name)
            }
            if (animal && animal.species && typeof animal.species === 'string' && animal.species.toLowerCase().includes(query)) {
              suggestions.add(animal.species)
            }
            if (animal && animal.habitat && typeof animal.habitat === 'string' && animal.habitat.toLowerCase().includes(query)) {
              suggestions.add(animal.habitat)
            }
          } catch (e) {
            // 跳过单个动物处理错误
          }
        })
      }
    } catch (e) {
      console.warn('处理动物数据时出错:', e)
    }
    
    // 添加热门搜索匹配项
    try {
      if (hotSearches.value && Array.isArray(hotSearches.value) && hotSearches.value.length > 0) {
        hotSearches.value.forEach(hot => {
          try {
            if (hot && typeof hot === 'string' && hot.toLowerCase().includes(query)) {
              suggestions.add(hot)
            }
          } catch (e) {
            // 跳过单个热门搜索项处理错误
          }
        })
      }
    } catch (e) {
      console.warn('处理热门搜索时出错:', e)
    }
    
    return Array.from(suggestions).slice(0, 5)
  } catch (error) {
    console.error('生成搜索建议失败:', error)
    return []
  }
})

// 计算属性
const animalStats = computed(() => {
  try {
    return animalStore.getAnimalStats() || {
      totalAnimals: 0,
      favoriteCount: 0,
      accuracy: 0,
      thisWeek: 0,
      total: 0,
      averageConfidence: 0,
      mostCommonAnimal: null,
      recentCount: 0
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
    return {
      totalAnimals: 0,
      favoriteCount: 0,
      accuracy: 0,
      thisWeek: 0,
      total: 0,
      averageConfidence: 0,
      mostCommonAnimal: null,
      recentCount: 0
    }
  }
})

const recentAnimals = computed(() => {
  try {
    return animalStore.recentAnimals || []
  } catch (error) {
    console.error('获取最近动物失败:', error)
    return []
  }
})

// 防抖搜索
const debouncedSearch = debounce((query: string) => {
  if (query.trim()) {
    // 添加到搜索历史
    addToSearchHistory(query)
  }
}, 300)

// 节流语音搜索
const throttledVoiceSearch = throttle(() => {
  startVoiceRecognition()
}, 1000)

// 方法
const handleSearch = (query: string) => {
  try {
    if (query && query.trim()) {
      debouncedSearch(query)
      showSearchSuggestions.value = false
    }
  } catch (error) {
    console.error('搜索处理失败:', error)
  }
}

// @ts-expect-error - 预留功能
const handleSearchFocus = () => {
  goToSearchPage()
}

const goToSearchPage = () => {
  router.push('/search')
}

const handleSearchClear = () => {
  showSearchSuggestions.value = false
}

// @ts-expect-error - 预留功能
const selectSearchSuggestion = (text: string) => {
  searchQuery.value = text
  handleSearch(text)
  showSearchSuggestions.value = false
}

// @ts-expect-error - 预留功能
const highlightText = (text: string, query: string): string => {
  try {
    if (!text || !query || !query.trim()) return text || ''
    // 转义特殊字符
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  } catch (error) {
    console.error('高亮文本失败:', error)
    return text || ''
  }
}

// 搜索历史管理
const addToSearchHistory = (query: string) => {
  if (!query.trim()) return
  
  const index = searchHistory.value.indexOf(query)
  if (index > -1) {
    // 如果已存在，移到最前面
    searchHistory.value.splice(index, 1)
  }
  
  searchHistory.value.unshift(query)
  
  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  
  saveSearchHistory()
}

// @ts-expect-error - 预留功能
const removeFromHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  saveSearchHistory()
}

// @ts-expect-error - 预留功能
const clearSearchHistory = () => {
  if (confirm('确定要清除搜索历史吗？')) {
    searchHistory.value = []
    saveSearchHistory()
  }
}

const saveSearchHistory = () => {
  try {
    localStorage.setItem('animalsnap-search-history', JSON.stringify(searchHistory.value))
  } catch (error) {
    console.error('保存搜索历史失败:', error)
  }
}

const loadSearchHistory = () => {
  try {
    const stored = localStorage.getItem('animalsnap-search-history')
    if (stored) {
      searchHistory.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
  }
}

// 语音识别
const startVoiceRecognition = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('您的浏览器不支持语音识别功能')
    return
  }
  
  try {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onstart = () => {
      console.log('开始语音识别...')
    }
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      searchQuery.value = transcript
      handleSearch(transcript)
    }
    
    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error)
      alert('语音识别失败，请重试')
    }
    
    recognition.onend = () => {
      console.log('语音识别结束')
    }
    
    recognition.start()
  } catch (error) {
    console.error('语音识别初始化失败:', error)
    alert('语音识别功能不可用')
  }
}

const startVoiceSearch = () => {
  throttledVoiceSearch()
}

const toggleFavorite = (animalId: string, isFavorite: boolean) => {
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

const viewAnimalDetail = (id: string) => {
  router.push(`/animal-detail/${id}`)
}

// 点击外部关闭搜索建议
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.search-container') && showSearchSuggestions.value) {
    showSearchSuggestions.value = false
  }
}

onMounted(() => {
  try {
    animalStore.loadAnimals()
    favorites.value = ['animal-1', 'animal-3']
    loadSearchHistory()
    document.addEventListener('click', handleClickOutside)
  } catch (error) {
    console.error('页面初始化失败:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
  padding: 16px;
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
  margin-bottom: 24px;
}

.greeting h1 {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.greeting p {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-primary);
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
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
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.location {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

/* 搜索栏 */
.search-container {
  margin-bottom: 20px;
  position: relative;
}

/* 搜索建议下拉框 */
.search-suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--color-bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
}

.suggestions-section {
  padding: 16px;
}

.suggestions-section + .suggestions-section {
  border-top: 1px solid var(--color-border-light);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.section-title svg {
  color: var(--color-text-secondary);
}

.clear-history-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-history-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

/* 热门搜索标签 */
.hot-searches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-search-tag {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-search-tag:hover {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

/* 搜索历史 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--color-bg-secondary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.history-item:hover {
  background: var(--color-bg-tertiary);
}

.history-item svg:first-child {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.history-item span {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 14px;
}

.remove-history {
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-history:hover {
  background: var(--color-error);
  color: var(--color-bg-primary);
}

/* 搜索建议列表 */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.suggestion-item:hover {
  background: var(--color-bg-tertiary);
}

.suggestion-item svg {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.suggestion-item span {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 14px;
}

.suggestion-item span mark {
  background: var(--color-warning);
  color: var(--color-bg-primary);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}

/* 快速操作 */
.quick-actions {
  margin-bottom: 30px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
  margin-bottom: 12px;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.action-card.primary {
  background: var(--color-accent);
  color: white;
  border: none;
}

.action-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--color-text-primary);
}

.action-content h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--color-text-primary);
}

.action-card.primary .action-content h3 {
  color: white;
}

.action-content p {
  font-size: 13px;
  margin: 0;
  opacity: 0.8;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 12px;
  flex-shrink: 0;
}

.diagnosis-icon {
  color: var(--color-success);
}

.expert-icon {
  color: var(--color-warning);
}

.action-arrow {
  font-size: 20px;
  margin-left: auto;
}

/* 统计仪表板 */
.stats-dashboard {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
}

.stats-dashboard h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: var(--color-bg-tertiary);
}

.stat-icon {
  font-size: 24px;
}

.stat-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.stat-content p {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

/* 搜索结果 */
.search-results {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
}

.result-count {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.empty-search {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-search h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.empty-search p {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 20px;
}

/* 最近动物 */
.recent-animals {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  color: var(--color-text-primary);
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 底部提示 */
.bottom-tip {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid var(--color-border);
}

.tip-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.tip-content p {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 16px;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-light);
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

/* 深色模式样式已通过CSS变量自动处理 */
</style>
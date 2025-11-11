<template>
  <div class="search-page">
    <!-- 顶部搜索栏 -->
    <div class="search-header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="search-input-wrapper">
        <SearchBar
          ref="searchBarRef"
          v-model="searchQuery"
          placeholder="搜索动物、栖息地..."
          @search="handleSearch"
          @voice-search="startVoiceSearch"
          @focus="handleSearchFocus"
          @clear="handleSearchClear"
          autofocus
        />
      </div>
    </div>

    <!-- 搜索建议下拉框 -->
    <div v-if="showSearchSuggestions && !isSearching" class="search-suggestions">
      <!-- 热门搜索 -->
      <div v-if="!searchQuery.trim() && hotSearches && hotSearches.length > 0" class="suggestions-section">
        <div class="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
          </svg>
          热门搜索
        </div>
        <div class="hot-searches">
          <button 
            v-for="(hot, index) in hotSearches" 
            :key="index"
            @click="selectSearchSuggestion(hot)"
            class="hot-search-tag"
          >
            {{ hot }}
          </button>
        </div>
      </div>
      
      <!-- 搜索历史 -->
      <div v-if="!searchQuery.trim() && searchHistory && searchHistory.length > 0" class="suggestions-section">
        <div class="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2"/>
          </svg>
          搜索历史
          <button @click="clearSearchHistory" class="clear-history-btn">清除</button>
        </div>
        <div class="history-list">
          <button 
            v-for="(history, index) in searchHistory" 
            :key="index"
            @click="selectSearchSuggestion(history)"
            class="history-item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>{{ history }}</span>
            <button @click.stop="removeFromHistory(index)" class="remove-history">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </button>
        </div>
      </div>
      
      <!-- 搜索建议 -->
      <div v-if="searchQuery.trim() && searchSuggestions && searchSuggestions.length > 0" class="suggestions-section">
        <div class="suggestions-list">
          <button 
            v-for="(suggestion, index) in searchSuggestions" 
            :key="index"
            @click="selectSearchSuggestion(suggestion)"
            class="suggestion-item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span v-html="highlightText(suggestion, searchQuery)"></span>
          </button>
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

    <!-- 空状态（无搜索时） -->
    <div v-if="!isSearching && !showSearchSuggestions" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>开始搜索</h3>
      <p>搜索动物、栖息地或使用语音搜索</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAnimalStore } from '../store/animal'
import { debounce, throttle, performanceMonitor } from '../utils/performance'
import SearchBar from '../components/SearchBar.vue'
import AnimalCard from '../components/AnimalCard.vue'

const router = useRouter()
const route = useRoute()
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

// 防抖搜索
const debouncedSearch = debounce((query: string) => {
  if (query.trim()) {
    performanceMonitor.mark('search-start')
    // 添加到搜索历史
    addToSearchHistory(query)
    performanceMonitor.measure('search-duration', 'search-start')
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

const handleSearchFocus = () => {
  showSearchSuggestions.value = true
  loadSearchHistory()
}

const handleSearchClear = () => {
  showSearchSuggestions.value = false
  searchQuery.value = ''
}

const selectSearchSuggestion = (text: string) => {
  searchQuery.value = text
  handleSearch(text)
  showSearchSuggestions.value = false
}

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

const removeFromHistory = (index: number) => {
  searchHistory.value.splice(index, 1)
  saveSearchHistory()
}

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

const viewAnimalDetail = (id: string) => {
  router.push(`/animal-detail/${id}`)
}

const goBack = () => {
  router.back()
}

// 点击外部关闭搜索建议
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.search-header') && !target.closest('.search-suggestions') && showSearchSuggestions.value) {
    showSearchSuggestions.value = false
  }
}

onMounted(() => {
  try {
    performanceMonitor.mark('search-page-mounted')
    animalStore.loadAnimals()
    favorites.value = []
    loadSearchHistory()
    document.addEventListener('click', handleClickOutside)
    
    // 如果有查询参数，设置搜索关键词
    const query = route.query.q as string
    if (query) {
      searchQuery.value = query
      handleSearch(query)
    } else {
      // 自动聚焦搜索框
      setTimeout(() => {
        if (searchBarRef.value) {
          searchBarRef.value.focus()
        }
      }, 100)
    }
    
    performanceMonitor.measure('search-page-load', 'search-page-mounted')
  } catch (error) {
    console.error('页面初始化失败:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

/* 搜索头部 */
.search-header {
  background: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f7fa;
  border: none;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-btn:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

.back-btn:active {
  transform: scale(0.95);
}

.search-input-wrapper {
  flex: 1;
}

/* 搜索建议下拉框 */
.search-suggestions {
  background: white;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-top: -1px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.suggestions-section {
  padding: 16px;
}

.suggestions-section + .suggestions-section {
  border-top: 1px solid #f3f4f6;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 12px;
}

.section-title svg {
  color: #4F46E5;
}

.clear-history-btn {
  background: none;
  border: none;
  color: #6B7280;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-history-btn:hover {
  background: #f3f4f6;
  color: #4F46E5;
}

/* 热门搜索标签 */
.hot-searches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-search-tag {
  background: #f0f4ff;
  color: #4F46E5;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-search-tag:hover {
  background: #4F46E5;
  color: white;
  border-color: #4F46E5;
  transform: translateY(-1px);
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
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.history-item:hover {
  background: #f0f4ff;
}

.history-item svg:first-child {
  color: #6B7280;
  flex-shrink: 0;
}

.history-item span {
  flex: 1;
  color: #1F2937;
  font-size: 14px;
}

.remove-history {
  background: none;
  border: none;
  color: #9CA3AF;
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
  background: #fee2e2;
  color: #ef4444;
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
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.suggestion-item:hover {
  background: #f0f4ff;
}

.suggestion-item svg {
  color: #6B7280;
  flex-shrink: 0;
}

.suggestion-item span {
  flex: 1;
  color: #1F2937;
  font-size: 14px;
}

.suggestion-item span mark {
  background: #fef3c7;
  color: #92400e;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}

/* 搜索结果 */
.search-results {
  padding: 20px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.result-count {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

.animals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
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
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.empty-search p {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
}

.btn-primary {
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-state .empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 16px;
  color: #6B7280;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .search-header {
    padding: 10px 12px;
  }
  
  .back-btn {
    width: 36px;
    height: 36px;
  }
  
  .animals-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .empty-search,
  .empty-state {
    padding: 40px 20px;
  }
  
  .empty-icon {
    font-size: 48px;
  }
}
</style>


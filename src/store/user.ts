import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  notifications: boolean
  autoSave: boolean
  imageQuality: 'low' | 'medium' | 'high'
}

export interface UserStats {
  totalAnimals: number
  totalIdentifications: number
  averageConfidence: number
  favoriteAnimal: string | null
  lastActiveDate: string
  collectionsCreated: number
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const settings = ref<UserSettings>({
    theme: 'auto',
    language: 'zh-CN',
    notifications: true,
    autoSave: true,
    imageQuality: 'high'
  })

  const stats = ref<UserStats>({
    totalAnimals: 0,
    totalIdentifications: 0,
    averageConfidence: 0,
    favoriteAnimal: null,
    lastActiveDate: new Date().toISOString(),
    collectionsCreated: 0
  })

  const isFirstVisit = ref(true)
  const hasSeenTutorial = ref(false)

  // 计算属性
  const isDarkMode = computed(() => {
    if (settings.value.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return settings.value.theme === 'dark'
  })

  const displayLanguage = computed(() => settings.value.language)
  
  const userStats = computed(() => stats.value)
  
  const currentTheme = computed(() => settings.value.theme)

  // 方法
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveToLocalStorage()
  }

  const updateStats = (newStats: Partial<UserStats>) => {
    stats.value = { ...stats.value, ...newStats }
    saveToLocalStorage()
  }

  const resetSettings = () => {
    settings.value = {
      theme: 'auto',
      language: 'zh-CN',
      notifications: true,
      autoSave: true,
      imageQuality: 'high'
    }
    saveToLocalStorage()
  }

  const markTutorialAsSeen = () => {
    hasSeenTutorial.value = true
    saveToLocalStorage()
  }

  const markFirstVisitComplete = () => {
    isFirstVisit.value = false
    saveToLocalStorage()
  }

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(settings.value.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    settings.value.theme = themes[nextIndex] as 'light' | 'dark' | 'auto'
    saveToLocalStorage()
  }

  const toggleNotifications = () => {
    settings.value.notifications = !settings.value.notifications
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    try {
      const userData = {
        settings: settings.value,
        stats: stats.value,
        isFirstVisit: isFirstVisit.value,
        hasSeenTutorial: hasSeenTutorial.value
      }
      localStorage.setItem('animalsnap-user', JSON.stringify(userData))
    } catch (error) {
      console.error('保存用户数据失败:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('animalsnap-user')
      if (stored) {
        const userData = JSON.parse(stored)
        if (userData.settings) settings.value = userData.settings
        if (userData.stats) stats.value = userData.stats
        if (userData.isFirstVisit !== undefined) isFirstVisit.value = userData.isFirstVisit
        if (userData.hasSeenTutorial !== undefined) hasSeenTutorial.value = userData.hasSeenTutorial
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }
  }

  // 初始化时从本地存储加载数据
  loadFromLocalStorage()

  return {
    // 状态
    settings,
    stats,
    isFirstVisit,
    hasSeenTutorial,

    // 计算属性
    isDarkMode,
    displayLanguage,
    userStats,
    currentTheme,

    // 方法
    updateSettings,
    updateStats,
    resetSettings,
    markTutorialAsSeen,
    markFirstVisitComplete,
    toggleTheme,
    toggleNotifications,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})

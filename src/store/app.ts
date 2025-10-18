import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AppState {
  isLoading: boolean
  isOnline: boolean
  currentPage: string
  lastError: string | null
  cameraPermission: 'granted' | 'denied' | 'prompt'
  isIdentifying: boolean
  identificationProgress: number
}

export const useAppStore = defineStore('app', () => {
  // 状态
  const state = ref<AppState>({
    isLoading: false,
    isOnline: navigator.onLine,
    currentPage: 'camera',
    lastError: null,
    cameraPermission: 'prompt',
    isIdentifying: false,
    identificationProgress: 0
  })

  // 计算属性
  const isOffline = computed(() => !state.value.isOnline)
  const hasError = computed(() => state.value.lastError !== null)
  const canUseCamera = computed(() => state.value.cameraPermission === 'granted')

  // 方法
  const setLoading = (loading: boolean) => {
    state.value.isLoading = loading
  }

  const setOnline = (online: boolean) => {
    state.value.isOnline = online
  }

  const setCurrentPage = (page: string) => {
    state.value.currentPage = page
  }

  const setError = (error: string | null) => {
    state.value.lastError = error
  }

  const clearError = () => {
    state.value.lastError = null
  }

  const setCameraPermission = (permission: 'granted' | 'denied' | 'prompt') => {
    state.value.cameraPermission = permission
  }

  const startIdentification = () => {
    state.value.isIdentifying = true
    state.value.identificationProgress = 0
  }

  const updateIdentificationProgress = (progress: number) => {
    state.value.identificationProgress = Math.min(100, Math.max(0, progress))
  }

  const finishIdentification = () => {
    state.value.isIdentifying = false
    state.value.identificationProgress = 100
    // 延迟重置进度条
    setTimeout(() => {
      state.value.identificationProgress = 0
    }, 1000)
  }

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraPermission('granted')
      // 立即停止流，我们只是检查权限
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      setCameraPermission('denied')
      setError('无法访问相机，请检查权限设置')
      return false
    }
  }

  const checkOnlineStatus = () => {
    setOnline(navigator.onLine)
  }

  // 监听网络状态变化
  const setupNetworkListeners = () => {
    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
  }

  const cleanupNetworkListeners = () => {
    window.removeEventListener('online', () => setOnline(true))
    window.removeEventListener('offline', () => setOnline(false))
  }

  return {
    // 状态
    state,

    // 计算属性
    isOffline,
    hasError,
    canUseCamera,

    // 方法
    setLoading,
    setOnline,
    setCurrentPage,
    setError,
    clearError,
    setCameraPermission,
    startIdentification,
    updateIdentificationProgress,
    finishIdentification,
    requestCameraPermission,
    checkOnlineStatus,
    setupNetworkListeners,
    cleanupNetworkListeners
  }
})

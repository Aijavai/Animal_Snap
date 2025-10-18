import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
  read: boolean
}

export const useNotificationStore = defineStore('notifications', () => {
  // 状态
  const notifications = ref<Notification[]>([])
  const maxNotifications = 50

  // 计算属性
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const recentNotifications = computed(() => 
    notifications.value
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
  )

  // 方法
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    }

    notifications.value.unshift(newNotification)

    // 限制通知数量
    if (notifications.value.length > maxNotifications) {
      notifications.value = notifications.value.slice(0, maxNotifications)
    }

    // 自动移除通知
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, notification.duration)
    }

    saveToLocalStorage()
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
      saveToLocalStorage()
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    saveToLocalStorage()
  }

  const clearAll = () => {
    notifications.value = []
    saveToLocalStorage()
  }

  const clearRead = () => {
    notifications.value = notifications.value.filter(n => !n.read)
    saveToLocalStorage()
  }

  // 便捷方法
  const success = (title: string, message: string, duration = 3000) => {
    addNotification({ type: 'success', title, message, duration })
  }

  const error = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message: string, duration = 4000) => {
    addNotification({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message: string, duration = 3000) => {
    addNotification({ type: 'info', title, message, duration })
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('animalsnap-notifications', JSON.stringify(notifications.value))
    } catch (error) {
      console.error('保存通知数据失败:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('animalsnap-notifications')
      if (stored) {
        notifications.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载通知数据失败:', error)
    }
  }

  // 初始化时从本地存储加载数据
  loadFromLocalStorage()

  return {
    // 状态
    notifications,

    // 计算属性
    unreadCount,
    recentNotifications,

    // 方法
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearRead,

    // 便捷方法
    success,
    error,
    warning,
    info,

    // 存储方法
    saveToLocalStorage,
    loadFromLocalStorage
  }
})

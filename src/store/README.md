# Store 使用指南

## 概述

本项目使用 Pinia 作为状态管理库，提供了完整的应用状态管理解决方案。

## Store 结构

### 1. Plant Store (`plant.ts`)
管理植物相关的所有状态和操作。

#### 状态
- `plants`: 植物列表
- `plantCount`: 植物总数（计算属性）
- `recentPlants`: 最近添加的植物（计算属性）
- `plantsByConfidence`: 按置信度排序的植物（计算属性）

#### 主要方法
```typescript
// 基础操作
addPlant(plant: Omit<Plant, 'id'>) // 添加植物
removePlant(id: string) // 删除植物
getPlantById(id: string) // 根据ID获取植物
clearAllPlants() // 清空所有植物

// 搜索和筛选
searchPlants(query: string) // 搜索植物
getPlantsByDateRange(startDate: string, endDate: string) // 按日期范围筛选
getPlantsByConfidenceRange(min: number, max: number) // 按置信度范围筛选

// 数据管理
exportPlants() // 导出植物数据
importPlants(data: any) // 导入植物数据
getPlantStats() // 获取植物统计信息
```

### 2. User Store (`user.ts`)
管理用户设置和统计信息。

#### 状态
- `settings`: 用户设置
- `stats`: 用户统计信息
- `isFirstVisit`: 是否首次访问
- `hasSeenTutorial`: 是否已看过教程

#### 主要方法
```typescript
// 设置管理
updateSettings(newSettings: Partial<UserSettings>) // 更新设置
resetSettings() // 重置设置

// 统计管理
updateStats(newStats: Partial<UserStats>) // 更新统计信息

// 教程管理
markTutorialAsSeen() // 标记教程已看
markFirstVisitComplete() // 标记首次访问完成
```

### 3. App Store (`app.ts`)
管理应用全局状态。

#### 状态
- `isLoading`: 是否正在加载
- `isOnline`: 是否在线
- `currentPage`: 当前页面
- `lastError`: 最后错误信息
- `cameraPermission`: 相机权限状态
- `isIdentifying`: 是否正在识别
- `identificationProgress`: 识别进度

#### 主要方法
```typescript
// 状态管理
setLoading(loading: boolean) // 设置加载状态
setOnline(online: boolean) // 设置在线状态
setCurrentPage(page: string) // 设置当前页面
setError(error: string | null) // 设置错误信息
clearError() // 清除错误

// 相机管理
setCameraPermission(permission: 'granted' | 'denied' | 'prompt') // 设置相机权限
requestCameraPermission() // 请求相机权限

// 识别管理
startIdentification() // 开始识别
updateIdentificationProgress(progress: number) // 更新识别进度
finishIdentification() // 完成识别
```

### 4. Notification Store (`notifications.ts`)
管理通知系统。

#### 状态
- `notifications`: 通知列表
- `unreadCount`: 未读通知数量（计算属性）
- `recentNotifications`: 最近通知（计算属性）

#### 主要方法
```typescript
// 通知管理
addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) // 添加通知
removeNotification(id: string) // 删除通知
markAsRead(id: string) // 标记为已读
markAllAsRead() // 标记所有为已读
clearAll() // 清空所有通知
clearRead() // 清空已读通知

// 便捷方法
success(title: string, message: string, duration?: number) // 成功通知
error(title: string, message: string, duration?: number) // 错误通知
warning(title: string, message: string, duration?: number) // 警告通知
info(title: string, message: string, duration?: number) // 信息通知
```

## 使用示例

### 在组件中使用 Store

```vue
<template>
  <div>
    <h1>我的植物 ({{ plantStore.plantCount }})</h1>
    <div v-if="appStore.state.isLoading">加载中...</div>
    <div v-else>
      <div v-for="plant in plantStore.plants" :key="plant.id">
        {{ plant.name }} - {{ plant.confidence }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlantStore, useAppStore, useNotificationStore } from '@/store'

const plantStore = usePlantStore()
const appStore = useAppStore()
const notificationStore = useNotificationStore()

// 添加植物
const addNewPlant = () => {
  plantStore.addPlant({
    name: '新植物',
    image: 'data:image/...',
    confidence: 95,
    description: '这是一个新植物',
    date: new Date().toISOString()
  })
  
  // 显示成功通知
  notificationStore.success('成功', '植物已添加！')
}

// 搜索植物
const searchPlants = (query: string) => {
  return plantStore.searchPlants(query)
}

// 获取植物统计
const stats = plantStore.getPlantStats()
console.log('植物统计:', stats)
</script>
```

### 在组合式函数中使用 Store

```typescript
// composables/usePlantManagement.ts
import { usePlantStore, useNotificationStore } from '@/store'

export function usePlantManagement() {
  const plantStore = usePlantStore()
  const notificationStore = useNotificationStore()

  const addPlantWithNotification = (plant: Omit<Plant, 'id'>) => {
    try {
      plantStore.addPlant(plant)
      notificationStore.success('成功', '植物已添加到收藏！')
    } catch (error) {
      notificationStore.error('错误', '添加植物失败')
    }
  }

  const deletePlantWithConfirmation = (id: string) => {
    if (confirm('确定要删除这个植物吗？')) {
      plantStore.removePlant(id)
      notificationStore.info('已删除', '植物已从收藏中移除')
    }
  }

  return {
    addPlantWithNotification,
    deletePlantWithConfirmation,
    searchPlants: plantStore.searchPlants,
    getPlantStats: plantStore.getPlantStats
  }
}
```

## 数据持久化

所有 Store 都支持本地存储持久化：

- **植物数据**: `animalsnap-plants`
- **用户数据**: `animalsnap-user`
- **通知数据**: `animalsnap-notifications`

数据会在应用启动时自动加载，在数据变更时自动保存。

## 类型安全

所有 Store 都提供了完整的 TypeScript 类型定义，确保类型安全和开发体验。

## 最佳实践

1. **在组件中直接使用 Store**，避免过度抽象
2. **使用计算属性**进行派生状态管理
3. **合理使用通知系统**提供用户反馈
4. **定期清理数据**避免本地存储过大
5. **使用组合式函数**封装复杂的业务逻辑

## 扩展

如需添加新的 Store，请遵循以下模式：

1. 创建新的 store 文件
2. 定义清晰的接口和类型
3. 提供完整的 CRUD 操作
4. 实现本地存储持久化
5. 在 `index.ts` 中导出
6. 编写使用文档和示例

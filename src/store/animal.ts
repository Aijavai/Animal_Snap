import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Animal {
  id: string
  name: string
  image: string
  confidence: number
  description: string
  species: string
  habitat: string
  date: string
}

export const useAnimalStore = defineStore('animal', () => {
  // 状态
  const animals = ref<Animal[]>([])
  
  // 计算属性
  const animalCount = computed(() => animals.value.length)
  
  const recentAnimals = computed(() => 
    animals.value
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  )
  
  const animalsByConfidence = computed(() => 
    animals.value.sort((a, b) => b.confidence - a.confidence)
  )
  
  // 方法
  const addAnimal = (animal: Omit<Animal, 'id'>) => {
    const newAnimal: Animal = {
      ...animal,
      id: Date.now().toString()
    }
    animals.value.unshift(newAnimal)
    saveToLocalStorage()
  }
  
  const removeAnimal = (id: string) => {
    const index = animals.value.findIndex(animal => animal.id === id)
    if (index > -1) {
      animals.value.splice(index, 1)
      saveToLocalStorage()
    }
  }
  
  const getAnimalById = (id: string) => {
    return animals.value.find(animal => animal.id === id)
  }
  
  const clearAllAnimals = () => {
    animals.value = []
    saveToLocalStorage()
  }
  
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('animalsnap-animals', JSON.stringify(animals.value))
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  }
  
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('animalsnap-animals')
      if (stored) {
        animals.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('从本地存储加载失败:', error)
    }
  }

  const searchAnimals = (query: string) => {
    if (!query.trim()) return animals.value
    
    const lowercaseQuery = query.toLowerCase()
    return animals.value.filter(animal => 
      animal.name.toLowerCase().includes(lowercaseQuery) ||
      animal.description.toLowerCase().includes(lowercaseQuery) ||
      animal.species.toLowerCase().includes(lowercaseQuery) ||
      animal.habitat.toLowerCase().includes(lowercaseQuery)
    )
  }

  const getAnimalsByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    
    return animals.value.filter(animal => {
      const animalDate = new Date(animal.date).getTime()
      return animalDate >= start && animalDate <= end
    })
  }

  const getAnimalsByConfidenceRange = (minConfidence: number, maxConfidence: number) => {
    return animals.value.filter(animal => 
      animal.confidence >= minConfidence && animal.confidence <= maxConfidence
    )
  }

  const exportAnimals = () => {
    const exportData = {
      animals: animals.value,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      totalCount: animals.value.length
    }
    return exportData
  }

  const importAnimals = (importData: any) => {
    try {
      if (importData.animals && Array.isArray(importData.animals)) {
        animals.value = importData.animals
        saveToLocalStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('导入动物数据失败:', error)
      return false
    }
  }

  const getAnimalStats = () => {
    if (animals.value.length === 0) {
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

    const total = animals.value.length
    const averageConfidence = animals.value.reduce((sum, animal) => sum + animal.confidence, 0) / total
    
    // 统计最常见的动物
    const animalCounts = animals.value.reduce((acc, animal) => {
      acc[animal.name] = (acc[animal.name] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const mostCommonAnimal = Object.entries(animalCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null

    // 最近7天的动物数量
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentCount = animals.value.filter(animal => 
      new Date(animal.date) >= sevenDaysAgo
    ).length

    // 收藏数量（模拟数据）
    const favoriteCount = Math.floor(total * 0.3)

    return {
      totalAnimals: total,
      favoriteCount: favoriteCount,
      accuracy: Math.round(averageConfidence * 100),
      thisWeek: recentCount,
      total,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      mostCommonAnimal,
      recentCount
    }
  }

  // 初始化时从本地存储加载数据
  loadFromLocalStorage()
  
  // 如果没有数据，添加一些模拟数据
  if (animals.value.length === 0) {
    const mockAnimals: Animal[] = [
      {
        id: 'animal-1',
        name: '金毛犬',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
        confidence: 0.95,
        description: '金毛犬是一种大型犬，性格温顺，是很好的家庭宠物。',
        species: '犬科',
        habitat: '家庭',
        date: new Date().toISOString()
      },
      {
        id: 'animal-2',
        name: '橘猫',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
        confidence: 0.88,
        description: '橘猫是常见的家猫品种，性格活泼好动。',
        species: '猫科',
        habitat: '家庭',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'animal-3',
        name: '哈士奇',
        image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=300&fit=crop',
        confidence: 0.92,
        description: '哈士奇是一种工作犬，精力充沛，需要大量运动。',
        species: '犬科',
        habitat: '家庭',
        date: new Date(Date.now() - 172800000).toISOString()
      }
    ]
    
    animals.value = mockAnimals
    saveToLocalStorage()
  }
  
  // 添加loadAnimals方法别名
  const loadAnimals = () => {
    loadFromLocalStorage()
  }
  
  return {
    // 状态
    animals,
    
    // 计算属性
    animalCount,
    recentAnimals,
    animalsByConfidence,
    
    // 基础方法
    addAnimal,
    removeAnimal,
    getAnimalById,
    clearAllAnimals,
    
    // 搜索和筛选方法
    searchAnimals,
    getAnimalsByDateRange,
    getAnimalsByConfidenceRange,
    
    // 数据管理方法
    exportAnimals,
    importAnimals,
    getAnimalStats,
    
    // 存储方法
    saveToLocalStorage,
    loadFromLocalStorage,
    loadAnimals
  }
})

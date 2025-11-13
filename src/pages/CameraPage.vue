<template>
  <div class="camera-page">
    <div class="camera-container">
      <!-- 退出按钮 -->
      <button class="exit-btn" @click="handleExit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="camera-preview" ref="cameraPreview">
        <video ref="videoElement" autoplay muted playsinline></video>
        <div class="camera-overlay">
          <div class="focus-frame"></div>
          <div class="camera-tips">
            <p>将动物放在框内，点击拍照识别</p>
          </div>
        </div>
      </div>
      
      <div class="camera-controls">
        <button class="control-btn gallery-btn" @click="openGallery">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        
        <button class="capture-btn" @click="capturePhoto" :disabled="!isCameraReady">
          <div class="capture-inner"></div>
        </button>
        
        <button class="control-btn switch-camera-btn" @click="switchCamera" :disabled="!isCameraReady">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 识别结果弹窗 -->
    <div v-if="showResult" class="result-modal" @click="closeResult">
      <div class="result-content" @click.stop>
        <div class="result-header">
          <h3>识别结果</h3>
          <button class="close-btn" @click="closeResult">×</button>
        </div>
        <div class="result-body">
          <div class="animal-info">
            <img :src="resultImage" alt="识别结果" class="result-image">
            <div class="animal-details">
              <h4>{{ animalResult.name }}</h4>
              <p class="confidence">置信度: {{ Math.round(animalResult.confidence * 100) }}%</p>
              <p class="description">{{ animalResult.description }}</p>
            </div>
          </div>
          <div class="result-actions">
            <button class="btn-secondary" @click="closeResult">重新拍照</button>
            <button class="btn-primary" @click="saveAnimal">保存到我的动物</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnimalStore } from '../store/animal'

const router = useRouter()
const animalStore = useAnimalStore()

// 相机相关状态
const videoElement = ref<HTMLVideoElement>()
const cameraPreview = ref<HTMLDivElement>()
const isCameraReady = ref(false)
const showResult = ref(false)
const resultImage = ref('')
const animalResult = ref({
  name: '',
  confidence: 0,
  description: ''
})

let stream: MediaStream | null = null
let currentFacingMode = 'environment'

// 初始化相机
const initCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }
    
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      videoElement.value.onloadedmetadata = () => {
        isCameraReady.value = true
      }
    }
  } catch (error) {
    console.error('无法访问相机:', error)
    alert('无法访问相机，请检查权限设置')
  }
}

// 切换相机
const switchCamera = async () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
  
  currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment'
  await initCamera()
}

// 拍照
const capturePhoto = () => {
  if (!videoElement.value || !isCameraReady.value) return
  
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  
  if (!context) return
  
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  
  context.drawImage(videoElement.value, 0, 0)
  
  const imageData = canvas.toDataURL('image/jpeg')
  resultImage.value = imageData
  
  // 模拟动物识别
  simulateAnimalIdentification(imageData)
}

// 模拟动物识别API
const simulateAnimalIdentification = (_imageData: string) => {
  // 模拟识别延迟
  setTimeout(() => {
    const mockResults = [
      {
        name: '金毛犬',
        confidence: 0.95,
        description: '金毛犬是一种大型犬，性格温顺，是优秀的家庭伴侣犬。'
      },
      {
        name: '橘猫',
        confidence: 0.88,
        description: '橘猫是常见的家猫品种，性格活泼，容易亲近人类。'
      },
      {
        name: '哈士奇',
        confidence: 0.92,
        description: '哈士奇是雪橇犬的一种，精力充沛，需要大量运动。'
      }
    ]
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    if (randomResult) {
      animalResult.value = randomResult
      showResult.value = true
    }
  }, 2000)
}

// 打开相册
const openGallery = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        resultImage.value = imageData
        simulateAnimalIdentification(imageData)
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

// 关闭结果弹窗
const closeResult = () => {
  showResult.value = false
}

// 保存动物
const saveAnimal = () => {
  const animal = {
    id: Date.now().toString(),
    name: animalResult.value.name,
    image: resultImage.value,
    confidence: animalResult.value.confidence,
    description: animalResult.value.description,
    species: '宠物',
    habitat: '家庭',
    date: new Date().toISOString()
  }
  
  animalStore.addAnimal(animal)
  closeResult()
  router.push('/')
}

// 清理资源
const cleanup = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
}

// 退出相机页面
const handleExit = () => {
  // 停止相机流
  cleanup()
  // 返回首页
  router.push('/')
}

onMounted(() => {
  initCamera()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.camera-page {
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}

.camera-container {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 退出按钮 */
.exit-btn {
  position: absolute;
  top: max(20px, env(safe-area-inset-top, 20px));
  left: max(20px, env(safe-area-inset-left, 20px));
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.exit-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.exit-btn:active {
  transform: scale(0.95);
}

.exit-btn svg {
  width: 24px;
  height: 24px;
}

.camera-preview {
  flex: 1;
  position: relative;
  background: #000;
  overflow: hidden;
}

.camera-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.focus-frame {
  width: 250px;
  height: 250px;
  border: 2px solid #fff;
  border-radius: 12px;
  position: relative;
}

.focus-frame::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
}

.camera-tips {
  margin-top: 20px;
  text-align: center;
}

.camera-tips p {
  color: #fff;
  font-size: 16px;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.camera-controls {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.capture-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-btn:hover {
  transform: scale(1.1);
}

.capture-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.capture-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary);
}

/* 结果弹窗样式 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.result-content {
  background: var(--color-bg-primary);
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.result-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.result-body {
  padding: 20px;
}

.animal-info {
  text-align: center;
  margin-bottom: 20px;
}

.result-image {
  width: 100%;
  max-width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.animal-details h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.confidence {
  color: var(--color-text-primary);
  font-weight: 600;
  margin: 5px 0;
}

.description {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
  margin: 10px 0 0 0;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.btn-primary:hover {
  background: var(--color-primary-light);
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background: var(--color-border);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .exit-btn {
    width: 40px;
    height: 40px;
    top: max(16px, env(safe-area-inset-top, 16px));
    left: max(16px, env(safe-area-inset-left, 16px));
  }
  
  .exit-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .camera-controls {
    padding: 0 30px;
  }
  
  .control-btn {
    width: 44px;
    height: 44px;
  }
  
  .capture-btn {
    width: 72px;
    height: 72px;
  }
  
  .capture-inner {
    width: 54px;
    height: 54px;
  }
}
</style>

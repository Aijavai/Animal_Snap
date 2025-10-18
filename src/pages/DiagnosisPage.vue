<template>
  <div class="diagnosis-page">
    <!-- 顶部标题 -->
    <div class="page-header">
      <h1>动物健康诊断</h1>
      <p>AI 智能分析动物健康状况</p>
    </div>

    <!-- 诊断步骤 -->
    <div class="diagnosis-steps">
      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <span>选择动物</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <span>上传照片</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <span>AI 分析</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 3 }"></div>
        <div class="step" :class="{ active: currentStep >= 4 }">
          <div class="step-number">4</div>
          <span>诊断结果</span>
        </div>
      </div>
    </div>

    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 步骤1: 选择动物 -->
      <div v-if="currentStep === 1" class="step-panel">
        <h3>选择要诊断的动物类型</h3>
        <div class="animal-categories">
          <div 
            v-for="category in animalCategories" 
            :key="category.id"
            class="category-card"
            :class="{ selected: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <h4>{{ category.name }}</h4>
            <p>{{ category.description }}</p>
          </div>
        </div>
        <button 
          class="btn-primary" 
          :disabled="!selectedCategory"
          @click="nextStep"
        >
          下一步
        </button>
      </div>

      <!-- 步骤2: 上传照片 -->
      <div v-if="currentStep === 2" class="step-panel">
        <h3>上传动物照片</h3>
        <div class="upload-area" @click="triggerFileUpload">
          <div v-if="!uploadedImage" class="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="17,8 21,12 17,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>点击上传照片</p>
            <span>支持 JPG、PNG 格式</span>
          </div>
          <div v-else class="uploaded-image">
            <img :src="uploadedImage" alt="上传的图片" />
            <button class="remove-image" @click.stop="removeImage">×</button>
          </div>
        </div>
        <input 
          ref="fileInput" 
          type="file" 
          accept="image/*" 
          @change="handleFileUpload" 
          style="display: none"
        />
        <div class="upload-tips">
          <h4>拍照建议：</h4>
          <ul>
            <li>确保动物在照片中清晰可见</li>
            <li>光线充足，避免阴影</li>
            <li>多角度拍摄效果更佳</li>
            <li>避免模糊或过暗的照片</li>
          </ul>
        </div>
        <div class="step-actions">
          <button class="btn-secondary" @click="prevStep">上一步</button>
          <button 
            class="btn-primary" 
            :disabled="!uploadedImage"
            @click="nextStep"
          >
            开始分析
          </button>
        </div>
      </div>

      <!-- 步骤3: AI 分析 -->
      <div v-if="currentStep === 3" class="step-panel">
        <div class="analysis-container">
          <div class="analysis-animation">
            <div class="pulse-circle"></div>
            <div class="pulse-circle delay-1"></div>
            <div class="pulse-circle delay-2"></div>
          </div>
          <h3>AI 正在分析中...</h3>
          <p>{{ analysisStatus }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: analysisProgress + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 步骤4: 诊断结果 -->
      <div v-if="currentStep === 4" class="step-panel">
        <div class="result-container">
          <div class="result-header">
            <h3>诊断结果</h3>
            <div class="confidence-score">
              <span>置信度: {{ diagnosisResult.confidence }}%</span>
            </div>
          </div>
          
          <div class="result-content">
            <div class="health-status" :class="diagnosisResult.status">
              <div class="status-icon">
                <span v-if="diagnosisResult.status === 'healthy'">✅</span>
                <span v-else-if="diagnosisResult.status === 'warning'">⚠️</span>
                <span v-else>🚨</span>
              </div>
              <div class="status-text">
                <h4>{{ diagnosisResult.title }}</h4>
                <p>{{ diagnosisResult.description }}</p>
              </div>
            </div>

            <div class="diagnosis-details">
              <h4>详细分析</h4>
              <ul>
                <li v-for="detail in diagnosisResult.details" :key="detail">
                  {{ detail }}
                </li>
              </ul>
            </div>

            <div class="recommendations">
              <h4>建议措施</h4>
              <ul>
                <li v-for="recommendation in diagnosisResult.recommendations" :key="recommendation">
                  {{ recommendation }}
                </li>
              </ul>
            </div>

            <div class="expert-advice">
              <h4>专家建议</h4>
              <p>{{ diagnosisResult.expertAdvice }}</p>
              <button class="btn-outline" @click="consultExpert">
                咨询专家
              </button>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn-secondary" @click="restartDiagnosis">重新诊断</button>
          <button class="btn-primary" @click="saveResult">保存结果</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const currentStep = ref(1)
const selectedCategory = ref('')
const uploadedImage = ref('')
const fileInput = ref()
const analysisProgress = ref(0)
const analysisStatus = ref('正在上传图片...')

// 动物分类数据
const animalCategories = ref([
  {
    id: 'dog',
    name: '犬类',
    icon: '🐕',
    description: '包括各种犬种'
  },
  {
    id: 'cat',
    name: '猫类',
    icon: '🐱',
    description: '包括各种猫种'
  },
  {
    id: 'bird',
    name: '鸟类',
    icon: '🐦',
    description: '包括各种鸟类'
  },
  {
    id: 'fish',
    name: '鱼类',
    icon: '🐠',
    description: '包括各种鱼类'
  },
  {
    id: 'reptile',
    name: '爬行动物',
    icon: '🦎',
    description: '包括蜥蜴、蛇类等'
  },
  {
    id: 'other',
    name: '其他',
    icon: '🐾',
    description: '其他动物类型'
  }
])

// 诊断结果数据
const diagnosisResult = ref({
  confidence: 85,
  status: 'healthy', // healthy, warning, critical
  title: '健康状况良好',
  description: '您的宠物整体健康状况良好，未发现明显异常。',
  details: [
    '毛发状态正常，无脱落异常',
    '眼睛清澈明亮，无分泌物',
    '精神状态良好，活动正常',
    '食欲正常，消化系统健康'
  ],
  recommendations: [
    '继续保持良好的饮食习惯',
    '定期进行体检和疫苗接种',
    '保持适当的运动量',
    '注意观察日常行为变化'
  ],
  expertAdvice: '建议每半年进行一次全面体检，如有任何异常症状请及时咨询兽医。'
})

// 方法
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
    
    // 如果是分析步骤，开始模拟分析过程
    if (currentStep.value === 3) {
      startAnalysis()
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  uploadedImage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const startAnalysis = () => {
  const statuses = [
    '正在上传图片...',
    'AI 正在识别动物特征...',
    '分析健康状况...',
    '生成诊断报告...',
    '分析完成！'
  ]
  
  let statusIndex = 0
  const interval = setInterval(() => {
    analysisStatus.value = statuses[statusIndex]
    analysisProgress.value = ((statusIndex + 1) / statuses.length) * 100
    
    statusIndex++
    
    if (statusIndex >= statuses.length) {
      clearInterval(interval)
      // 使用 nextTick 确保 DOM 更新完成
      nextTick(() => {
        setTimeout(() => {
          nextStep()
        }, 1000)
      })
    }
  }, 1500) // 减少等待时间提升响应性
}

const restartDiagnosis = () => {
  currentStep.value = 1
  selectedCategory.value = ''
  uploadedImage.value = ''
  analysisProgress.value = 0
  analysisStatus.value = '正在上传图片...'
}

const saveResult = () => {
  // 保存诊断结果到本地存储
  const results = JSON.parse(localStorage.getItem('diagnosisResults') || '[]')
  results.push({
    id: Date.now(),
    category: selectedCategory.value,
    image: uploadedImage.value,
    result: diagnosisResult.value,
    date: new Date().toISOString()
  })
  localStorage.setItem('diagnosisResults', JSON.stringify(results))
  
  alert('诊断结果已保存！')
}

const consultExpert = () => {
  router.push('/expert')
}

onMounted(() => {
  // 页面加载时的初始化
})
</script>

<style scoped>
.diagnosis-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 16px;
  padding-bottom: 100px;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  opacity: 0.9;
}

/* 步骤指示器 */
.diagnosis-steps {
  margin-bottom: 30px;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.step.active {
  color: white;
}

.step.completed {
  color: #10B981;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #4F46E5;
  color: white;
}

.step.completed .step-number {
  background: #10B981;
  color: white;
}

.step-line {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 10px;
  transition: all 0.3s ease;
}

.step-line.active {
  background: #4F46E5;
}

/* 步骤内容 */
.step-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.step-panel h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 20px;
  text-align: center;
}

/* 动物分类选择 */
.animal-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.category-card {
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
}

.category-card:hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-card.selected {
  border-color: #4F46E5;
  background: #f0f4ff;
}

.category-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.category-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.category-card p {
  font-size: 12px;
  color: #6B7280;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.upload-area:hover {
  border-color: #4F46E5;
  background: #f0f4ff;
}

.upload-placeholder {
  color: #6B7280;
}

.upload-placeholder svg {
  margin-bottom: 16px;
  color: #9CA3AF;
}

.upload-placeholder p {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.upload-placeholder span {
  font-size: 14px;
  color: #9CA3AF;
}

.uploaded-image {
  position: relative;
  display: inline-block;
}

.uploaded-image img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-tips {
  background: #f0f9ff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.upload-tips h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.upload-tips ul {
  list-style: none;
  padding: 0;
}

.upload-tips li {
  font-size: 14px;
  color: #4B5563;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.upload-tips li::before {
  content: '•';
  color: #3B82F6;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* 分析动画 */
.analysis-container {
  text-align: center;
  padding: 40px 20px;
}

.analysis-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.pulse-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 3px solid #4F46E5;
  border-radius: 50%;
  transform: translate3d(-50%, -50%, 0);
  animation: pulse 2s infinite;
  will-change: transform, opacity;
}

.pulse-circle.delay-1 {
  animation-delay: 0.5s;
}

.pulse-circle.delay-2 {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: translate3d(-50%, -50%, 0) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate3d(-50%, -50%, 0) scale(2);
    opacity: 0;
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 20px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4F46E5, #7C3AED);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 诊断结果 */
.result-container {
  text-align: left;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.confidence-score {
  background: #f0f4ff;
  color: #4F46E5;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.health-status {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.health-status.healthy {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.health-status.warning {
  background: #fffbeb;
  border: 1px solid #fed7aa;
}

.health-status.critical {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.status-icon {
  font-size: 32px;
}

.status-text h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.status-text p {
  color: #6B7280;
  font-size: 14px;
}

.diagnosis-details,
.recommendations,
.expert-advice {
  margin-bottom: 20px;
}

.diagnosis-details h4,
.recommendations h4,
.expert-advice h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.diagnosis-details ul,
.recommendations ul {
  list-style: none;
  padding: 0;
}

.diagnosis-details li,
.recommendations li {
  font-size: 14px;
  color: #4B5563;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.diagnosis-details li::before,
.recommendations li::before {
  content: '•';
  color: #4F46E5;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.expert-advice {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #4F46E5;
}

.expert-advice p {
  color: #4B5563;
  font-size: 14px;
  margin-bottom: 16px;
}

/* 按钮样式 */
.btn-primary,
.btn-secondary,
.btn-outline {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-outline {
  background: transparent;
  color: #4F46E5;
  border: 1px solid #4F46E5;
}

.btn-outline:hover {
  background: #4F46E5;
  color: white;
}

.step-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .diagnosis-page {
    padding: 16px 12px;
  }
  
  .step-indicator {
    padding: 16px;
  }
  
  .step-number {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .step-line {
    width: 20px;
    margin: 0 5px;
  }
  
  .animal-categories {
    grid-template-columns: 1fr;
  }
  
  .step-content {
    padding: 20px;
  }
  
  .step-actions {
    flex-direction: column;
  }
}
</style>

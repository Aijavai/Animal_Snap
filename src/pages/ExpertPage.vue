<template>
  <div class="expert-page">
    <!-- 顶部标题 -->
    <div class="page-header">
      <h1>AI 动物专家助手</h1>
      <p>智能回答你的动物相关问题</p>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-container" ref="chatContainer">
      <div class="chat-messages">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', message.type]"
        >
          <div class="message-avatar">
            <div v-if="message.type === 'ai'" class="ai-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div v-else class="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="message ai">
          <div class="message-avatar">
            <div class="ai-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          @keydown.enter.prevent="handleSendMessage"
          placeholder="输入你的动物相关问题..."
          :disabled="isLoading"
          rows="1"
          ref="messageInput"
          @input="adjustTextareaHeight"
        ></textarea>
        <button 
          @click="handleSendMessage" 
          :disabled="!inputMessage.trim() || isLoading"
          class="send-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- 快捷问题 -->
      <div class="quick-questions" v-if="messages.length === 0">
        <h3>常见问题</h3>
        <div class="question-chips">
          <button 
            v-for="question in quickQuestions" 
            :key="question"
            @click="sendQuickQuestion(question)"
            class="question-chip"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { debounce, performanceMonitor } from '../utils/performance'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

// 响应式数据
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)

// 快捷问题
const quickQuestions = ref([
  '如何识别狗的品种？',
  '猫咪的常见疾病有哪些？',
  '鸟类如何区分雌雄？',
  '爬行动物的饲养要点',
  '鱼类的水质要求',
  '如何训练宠物？'
])

// 初始化欢迎消息
onMounted(() => {
  addMessage('ai', '你好！我是AI动物专家助手，可以回答你关于动物的任何问题。有什么可以帮助你的吗？')
})

// 添加消息
const addMessage = (type: 'user' | 'ai', content: string) => {
  const message: Message = {
    id: Date.now() + Math.random(),
    type,
    content,
    timestamp: new Date()
  }
  messages.value.push(message)
  scrollToBottom()
}

// 防抖发送消息
const debouncedSendMessage = debounce(async (message: string) => {
  if (!message.trim() || isLoading.value) return
  
  // 添加用户消息
  addMessage('user', message)
  
  // 显示加载状态
  isLoading.value = true
  performanceMonitor.mark('llm-request-start')
  
  try {
    // 这里连接你的LLM API
    const aiResponse = await callLLMAPI(message)
    addMessage('ai', aiResponse)
    performanceMonitor.measure('llm-request-duration', 'llm-request-start')
  } catch (error) {
    console.error('LLM API调用失败:', error)
    addMessage('ai', '抱歉，我现在无法回答你的问题。请稍后再试。')
  } finally {
    isLoading.value = false
  }
}, 300)

// 发送消息
const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  
  debouncedSendMessage(userMessage)
}

// 发送快捷问题
const sendQuickQuestion = (question: string) => {
  inputMessage.value = question
  handleSendMessage()
}

// 调用LLM API (这里需要你实现具体的API调用)
const callLLMAPI = async (_message: string): Promise<string> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // 这里替换为你的LLM API调用
  // 例如：
  // const response = await fetch('/api/llm', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message: _message })
  // })
  // const data = await response.json()
  // return data.response
  
  // 临时模拟回复
  const responses: string[] = [
    '这是一个很好的问题！让我来为你详细解答...',
    '根据我的知识，这个问题涉及到几个方面...',
    '我理解你的疑问。在动物学中，这个问题...',
    '这是一个常见的动物相关问题，让我为你分析一下...',
    '基于我的专业知识，我可以告诉你...'
  ]
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex] || '抱歉，我现在无法回答你的问题。'
}

// 格式化消息内容
const formatMessage = (content: string): string => {
  // 简单的换行处理
  return content.replace(/\n/g, '<br>')
}

// 格式化时间
const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 调整文本框高度
const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
  }
}
</script>

<style scoped>
.expert-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F9FAFB;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #E5E7EB;
  color: #111827;
  padding: 16px 20px;
  text-align: center;
}

.page-header h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.page-header p {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
}

/* 聊天容器 */
.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.ai {
  align-self: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar {
  background: #1F2937;
  color: white;
}

.user-avatar {
  background: #E5E7EB;
  color: #6B7280;
}

.message-content {
  background: white;
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message.user .message-content {
  background: #1F2937;
  color: white;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
}

/* 加载动画 */
.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6B7280;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.input-container {
  background: white;
  border-top: 1px solid #E5E7EB;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #F3F4F6;
  border-radius: 24px;
  padding: 8px 12px;
}

.input-wrapper textarea {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  max-height: 120px;
  min-height: 20px;
}

.input-wrapper textarea::placeholder {
  color: #9CA3AF;
}

.send-button {
  background: #1F2937;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: #374151;
}

.send-button:disabled {
  background: #D1D5DB;
  cursor: not-allowed;
}

/* 快捷问题 */
.quick-questions {
  margin-top: 16px;
}

.quick-questions h3 {
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  margin: 0 0 12px 0;
}

.question-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-chip {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-chip:hover {
  background: #1F2937;
  color: white;
  border-color: #1F2937;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .page-header {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .chat-container {
    padding: 16px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .input-container {
    padding: 12px 16px;
  }
  
  .question-chips {
    gap: 6px;
  }
  
  .question-chip {
    font-size: 11px;
    padding: 6px 12px;
  }
}
</style>
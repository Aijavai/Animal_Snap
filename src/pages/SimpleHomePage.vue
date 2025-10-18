<template>
  <div style="padding: 20px; text-align: center; font-size: 24px; color: #10B981;">
    <h1>简化首页</h1>
    <p>这是一个简化版本来检查首页是否显示。</p>
    <div style="margin-top: 20px;">
      <button @click="goToTest" style="margin: 10px; padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 8px; cursor: pointer;">
        去测试页面
      </button>
      <button @click="goToCamera" style="margin: 10px; padding: 10px 20px; background: #10B981; color: white; border: none; border-radius: 8px; cursor: pointer;">
        去拍照页面
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTest = () => {
  router.push('/test')
}

const goToCamera = () => {
  router.push('/camera')
}
</script>

<style scoped>
/* 简化首页样式 */
</style>

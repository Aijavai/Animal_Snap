<template>
  <div style="padding: 20px; text-align: center; font-size: 24px; color: #4F46E5;">
    <h1>测试页面</h1>
    <p>如果你看到这个，说明路由正常工作！</p>
    <button @click="goHome" style="margin-top: 20px; padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 8px; cursor: pointer;">
      返回首页
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* 测试页面样式 */
</style>

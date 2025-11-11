import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'vant-vendor': ['vant'],
          'utils': ['@vueuse/core']
        }
      }
    },
    // 资源内联阈值
    assetsInlineLimit: 4096
  },
  // 开发服务器优化
  server: {
    hmr: {
      overlay: false
    }
  },
  // 依赖预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vant', '@vueuse/core']
  }
})

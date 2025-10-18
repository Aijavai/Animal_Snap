<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['camera-icon-new', { active }]"
  >
    <!-- 相机主体 -->
    <rect 
      x="2" 
      y="7" 
      width="20" 
      height="12" 
      rx="2" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      :fill="fill ? color : 'none'"
    />
    <!-- 镜头 -->
    <circle 
      cx="12" 
      cy="13" 
      r="3" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      :fill="fill ? color : 'none'"
    />
    <!-- 镜头中心 -->
    <circle 
      cx="12" 
      cy="13" 
      r="1.5" 
      :fill="color"
    />
    <!-- 闪光灯 -->
    <rect 
      x="16" 
      y="8" 
      width="2" 
      height="1.5" 
      rx="0.5" 
      :fill="color"
    />
    <!-- 取景器 -->
    <rect 
      x="6" 
      y="8" 
      width="2" 
      height="1.5" 
      rx="0.5" 
      :stroke="color" 
      :stroke-width="strokeWidth"
    />
    <!-- 相机带 -->
    <path 
      d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
withDefaults(defineProps(), {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
  fill: false,
  active: false
})
</script>

<style scoped>
.camera-icon-new {
  transition: all 0.3s ease;
  display: inline-block;
}

.camera-icon-new:hover {
  transform: scale(1.15) rotate(5deg);
}

.camera-icon-new.active {
  transform: scale(1.1);
  animation: cameraFlash 0.5s ease-in-out;
}

@keyframes cameraFlash {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
}
</style>

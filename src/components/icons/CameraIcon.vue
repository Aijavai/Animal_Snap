<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['camera-icon', { active }]"
  >
    <!-- 相机机身 -->
    <path 
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :fill="fill ? color : 'none'"
    />
    <!-- 镜头 -->
    <circle 
      cx="12" 
      cy="13" 
      r="4" 
      :stroke="color" 
      :stroke-width="strokeWidth"
      :fill="fill ? 'rgba(255,255,255,0.1)' : 'none'"
    />
    <!-- 镜头中心点 -->
    <circle 
      cx="12" 
      cy="13" 
      r="1.5" 
      :fill="color"
    />
    <!-- 闪光灯 -->
    <rect 
      x="17" 
      y="6" 
      width="2" 
      height="2" 
      rx="1" 
      :fill="color"
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
.camera-icon {
  transition: all 0.3s ease;
  display: inline-block;
}

.camera-icon:hover {
  transform: scale(1.1);
}

.camera-icon.active {
  transform: scale(1.05);
}
</style>

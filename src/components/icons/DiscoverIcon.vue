<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['discover-icon', { active }]"
  >
    <!-- 指南针外圈 -->
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      :fill="fill ? color : 'none'"
    />
    <!-- 指南针指针 -->
    <path 
      d="M12 2l3 6-3 6-3-6 3-6z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :fill="fill ? color : 'none'"
    />
    <path 
      d="M12 10l-6 3 6 3 6-3-6-3z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :fill="fill ? color : 'none'"
    />
    <!-- 中心点 -->
    <circle 
      cx="12" 
      cy="12" 
      r="2" 
      :fill="color"
    />
    <!-- 方向标记 -->
    <path 
      d="M12 2v2M12 20v2M2 12h2M20 12h2" 
      :stroke="color" 
      :stroke-width="1" 
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
.discover-icon {
  transition: all 0.3s ease;
  display: inline-block;
}

.discover-icon:hover {
  transform: scale(1.1) rotate(15deg);
}

.discover-icon.active {
  transform: scale(1.05);
  animation: discoverSpin 2s linear infinite;
}

@keyframes discoverSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

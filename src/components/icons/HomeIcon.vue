<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['home-icon', { active }]"
  >
    <!-- 房子轮廓 -->
    <path 
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :fill="fill ? color : 'none'"
    />
    <!-- 门 -->
    <path 
      d="M9 22V12h6v10" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <!-- 窗户 -->
    <rect 
      x="2" 
      y="9" 
      width="4" 
      height="4" 
      rx="1" 
      :stroke="color" 
      :stroke-width="strokeWidth"
      :fill="fill ? color : 'none'"
    />
    <rect 
      x="18" 
      y="9" 
      width="4" 
      height="4" 
      rx="1" 
      :stroke="color" 
      :stroke-width="strokeWidth"
      :fill="fill ? color : 'none'"
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
.home-icon {
  transition: all 0.3s ease;
  display: inline-block;
}

.home-icon:hover {
  transform: scale(1.1);
}

.home-icon.active {
  transform: scale(1.05);
}
</style>

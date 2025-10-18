<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['animals-icon', { active }]"
  >
    <!-- 动物轮廓 -->
    <path 
      d="M12 2C8 2 5 5 5 9c0 2 1 3.5 2 4.5L7 16c0 1.5 1.5 3 3.5 3s3.5-1.5 3.5-3l0-2.5c1-1 2-2.5 2-4.5 0-4-3-7-7-7z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :fill="fill ? color : 'none'"
    />
    <!-- 耳朵 -->
    <path 
      d="M8 6c0-1 1-2 2-2s2 1 2 2M16 6c0-1 1-2 2-2s2 1 2 2" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round"
    />
    <!-- 眼睛 -->
    <circle 
      cx="9" 
      cy="9" 
      r="1" 
      :fill="color"
    />
    <circle 
      cx="15" 
      cy="9" 
      r="1" 
      :fill="color"
    />
    <!-- 鼻子 -->
    <circle 
      cx="12" 
      cy="12" 
      r="0.8" 
      :fill="color"
    />
    <!-- 嘴巴 -->
    <path 
      d="M10 14c0.5 1 1.5 1 2 0" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round"
    />
    <!-- 尾巴 -->
    <path 
      d="M19 12c1 0.5 1.5 1.5 1 2.5s-1.5 1-2.5 0.5" 
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
.animals-icon {
  transition: all 0.3s ease;
  display: inline-block;
}

.animals-icon:hover {
  transform: scale(1.1) rotate(1deg);
}

.animals-icon.active {
  transform: scale(1.05);
}

/* 动画效果 */
.animals-icon:hover path:first-child {
  animation: animalBounce 0.6s ease-in-out;
}

@keyframes animalBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
</style>

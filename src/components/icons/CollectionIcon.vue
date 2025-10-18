<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['collection-icon', { active }]"
  >
    <!-- 收藏夹 -->
    <path 
      d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      :fill="fill ? color : 'none'"
    />
    <!-- 内部网格 -->
    <path 
      d="M9 9h6v6H9z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M3 9h6v6H3z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M15 9h6v6h-6z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M9 15h6v6H9z" 
      :stroke="color" 
      :stroke-width="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
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
.collection-icon {
  transition: all 0.3s ease;
  display: inline-block;
}

.collection-icon:hover {
  transform: scale(1.1) rotate(2deg);
}

.collection-icon.active {
  transform: scale(1.05);
}
</style>

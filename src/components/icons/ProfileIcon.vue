<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none"
    :class="['profile-icon', { active }]"
  >
    <path 
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
      :stroke="color" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <circle 
      cx="12" 
      cy="7" 
      r="4" 
      :stroke="color" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  color?: string
  active?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 24,
  color: '#6B7280',
  active: false
})
</script>

<style scoped>
.profile-icon {
  transition: all 0.3s ease;
}

.profile-icon.active {
  transform: scale(1.1);
}
</style>
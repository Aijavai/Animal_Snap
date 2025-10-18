# 图标组件使用指南

本项目包含三个主要的图标组件，每个组件都支持多种自定义属性。

## 组件列表

### 1. CameraIcon - 相机图标
用于拍照识别功能

### 2. PlantsIcon - 植物图标  
用于我的植物收藏功能

### 3. ProfileIcon - 个人资料图标
用于个人中心功能

## 通用属性

所有图标组件都支持以下属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `number \| string` | `24` | 图标大小 |
| `color` | `string` | `'currentColor'` | 图标颜色 |
| `strokeWidth` | `number` | `2` | 描边宽度 |
| `fill` | `boolean` | `false` | 是否填充 |
| `active` | `boolean` | `false` | 是否激活状态 |

## 特殊属性

### ProfileIcon 额外属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `hasNotification` | `boolean` | `false` | 是否显示通知红点 |

## 使用示例

### 基础使用
```vue
<template>
  <CameraIcon />
  <PlantsIcon />
  <ProfileIcon />
</template>
```

### 自定义样式
```vue
<template>
  <!-- 大尺寸红色图标 -->
  <CameraIcon 
    :size="32" 
    color="#ff0000" 
    :stroke-width="3" 
  />
  
  <!-- 填充的激活状态图标 -->
  <PlantsIcon 
    :size="28" 
    color="#4CAF50" 
    :fill="true" 
    :active="true" 
  />
  
  <!-- 带通知的个人资料图标 -->
  <ProfileIcon 
    :size="24" 
    color="#333" 
    :has-notification="true" 
  />
</template>
```

### 在导航中使用
```vue
<template>
  <router-link to="/camera" class="nav-item">
    <CameraIcon 
      :active="$route.name === 'Camera'"
      :color="$route.name === 'Camera' ? '#4CAF50' : '#666'"
    />
    <span>拍照</span>
  </router-link>
</template>
```

## 动画效果

- **悬停效果**: 所有图标在悬停时会放大1.1倍
- **激活状态**: 激活时图标会略微放大1.05倍
- **植物图标**: 悬停时会有轻微的摇摆动画
- **通知图标**: 当有通知时会显示脉冲动画

## 样式定制

每个图标组件都有对应的CSS类，可以通过以下方式定制：

```css
.camera-icon {
  /* 相机图标样式 */
}

.plants-icon {
  /* 植物图标样式 */
}

.profile-icon {
  /* 个人资料图标样式 */
}
```

## 注意事项

1. 图标使用SVG格式，支持任意缩放而不失真
2. 默认继承父元素的颜色（`currentColor`）
3. 所有动画效果都经过优化，性能良好
4. 支持TypeScript类型检查

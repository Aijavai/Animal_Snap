# 主题设置功能说明

## 功能概述

AnimalSnap 现已支持完整的主题切换功能，包括：
- 🌞 浅色模式（Light Mode）
- 🌙 深色模式（Dark Mode）
- 🔄 跟随系统（Auto Mode）

## 使用方法

### 切换主题
1. 进入"我的"页面（底部导航栏最右侧）
2. 点击"设置"区域中的"主题设置"
3. 在展开的选项中选择你喜欢的主题：
   - **浅色模式**：适合白天使用，明亮清晰
   - **深色模式**：适合夜间使用，保护视力
   - **跟随系统**：自动匹配系统主题设置

### 主题特性
- ✅ 平滑过渡动画，无闪烁
- ✅ 持久化存储，记住你的选择
- ✅ 全局生效，所有页面统一
- ✅ 响应系统主题变化（Auto模式下）

## 技术实现

### CSS 变量系统
使用 CSS 自定义属性实现主题切换：

```css
:root {
  --color-primary: #1F2937;
  --color-bg-primary: #FFFFFF;
  --color-text-primary: #111827;
  /* ... 更多变量 */
}

.dark-theme {
  --color-primary: #F9FAFB;
  --color-bg-primary: #111827;
  --color-text-primary: #F9FAFB;
  /* ... 深色主题变量 */
}
```

### 状态管理
主题状态存储在 Pinia store (`store/user.ts`) 中：
- `settings.theme`: 当前主题设置 ('light' | 'dark' | 'auto')
- `isDarkMode`: 计算属性，返回当前是否为深色模式
- `toggleTheme()`: 循环切换主题
- `updateSettings({ theme })`: 设置指定主题

### 组件适配
所有主要组件已适配主题系统：
- ✅ App.vue - 全局主题控制
- ✅ MainLayout.vue - 底部导航栏
- ✅ HomePage.vue - 首页
- ✅ ProfilePage.vue - 个人中心
- ✅ 其他组件...

## 开发指南

### 在新组件中使用主题

1. **使用 CSS 变量**
```css
.my-component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

2. **访问主题状态**
```typescript
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const isDarkMode = computed(() => userStore.isDarkMode)
```

3. **切换主题**
```typescript
// 循环切换
userStore.toggleTheme()

// 设置指定主题
userStore.updateSettings({ theme: 'dark' })
```

### 可用的 CSS 变量

#### 颜色变量
- `--color-primary`: 主色调
- `--color-secondary`: 次要色
- `--color-accent`: 强调色

#### 背景色
- `--color-bg-primary`: 主背景
- `--color-bg-secondary`: 次背景
- `--color-bg-tertiary`: 三级背景

#### 文本色
- `--color-text-primary`: 主文本
- `--color-text-secondary`: 次要文本
- `--color-text-tertiary`: 三级文本

#### 边框色
- `--color-border`: 主边框
- `--color-border-light`: 浅色边框

#### 阴影
- `--shadow-sm`: 小阴影
- `--shadow-md`: 中阴影
- `--shadow-lg`: 大阴影

#### 状态色
- `--color-success`: 成功色
- `--color-warning`: 警告色
- `--color-error`: 错误色
- `--color-info`: 信息色

## 注意事项

1. **避免硬编码颜色**：始终使用 CSS 变量
2. **测试两种主题**：确保组件在浅色和深色模式下都显示正常
3. **平滑过渡**：使用 `transition` 属性实现主题切换动画
4. **语义化命名**：使用语义化的变量名（如 `--color-bg-primary`）而非具体颜色值

## 未来计划

- [ ] 添加更多主题（如：护眼模式、高对比度模式）
- [ ] 支持自定义主题颜色
- [ ] 添加主题切换快捷键
- [ ] 提供主题预览功能

---

**版本**: 1.0.0  
**更新日期**: 2025-11-11

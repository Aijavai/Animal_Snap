import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

// 导入 Vant 组件
import { Tabbar, TabbarItem } from 'vant'
import 'vant/lib/index.css'
import 'vant/es/tabbar/style'
import 'vant/es/tabbar-item/style'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册 Vant 组件
app.use(Tabbar)
app.use(TabbarItem)

app.mount('#app')

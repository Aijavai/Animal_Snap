import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '../pages/HomePage.vue'),
      meta: { title: '首页', preload: true }
    },
    {
      path: '/diagnosis',
      name: 'Diagnosis',
      component: () => import(/* webpackChunkName: "diagnosis" */ '../pages/DiagnosisPage.vue'),
      meta: { title: '动物诊断' }
    },
    {
      path: '/camera',
      name: 'Camera',
      component: () => import(/* webpackChunkName: "camera" */ '../pages/CameraPage.vue'),
      meta: { title: '拍照识别', showNav: false }
    },
    {
      path: '/expert',
      name: 'Expert',
      component: () => import(/* webpackChunkName: "expert" */ '../pages/ExpertPage.vue'),
      meta: { title: '咨询专家' }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import(/* webpackChunkName: "profile" */ '../pages/ProfilePage.vue'),
      meta: { title: '个人中心' }
    },
    {
      path: '/animal-detail/:id',
      name: 'AnimalDetail',
      component: () => import(/* webpackChunkName: "animal-detail" */ '../pages/AnimalDetailPage.vue'),
      meta: { title: '动物详情', showNav: false }
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import(/* webpackChunkName: "test" */ '../pages/TestPage.vue'),
      meta: { title: '测试页面', showNav: false }
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import(/* webpackChunkName: "search" */ '../pages/SearchPage.vue'),
      meta: { title: '搜索', showNav: false }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - AnimalSnap`
  }
  next()
})

export default router
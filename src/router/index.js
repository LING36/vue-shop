import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'

Vue.use(VueRouter)

const routes = [
  {
    // 重定向路由（访问 / 时跳转到登录页面）
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router

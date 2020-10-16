import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'

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
    component: Login,
    meta: {
      title: '登录'
    }
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫：说白了所有页面的导航都会经过这里  https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
// 守卫页面的导航的
// to：要去的路由路由信息
// from：来自哪的路由信息
// next：放行方法
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 如果要访问的页面不是登录页面，则校验登录状态
  // 如果没有登录，则跳转到登录页
  // 如果登录了，则允许通过
  const token = localStorage.getItem('token')
  if (to.path !== '/login') {
    if (token) {
      // 表示用户已登录，允许通过
      next()
    } else {
      // 表示用户没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    // 允许通过
    next()
  }
})

export default router

import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import Material from './pages/material/Material.vue'
import MaterialEntry from './pages/material/MaterialEntry.vue'
import MaterialOut from './pages/material/MaterialOut.vue'
import Dashboard from './pages/dashboard/Dashboard.vue'
import Login from './pages/login/Login.vue'

Vue.use(Router)

const isLogin = () => {
  const user = window.localStorage.getItem('user')
  return !!user || Object.keys(store.state.user.user).length !== 0
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/material',
    name: 'material',
    component: Material
  },

  {
    path: '/material/entry',
    name: 'materialEntry',
    component: MaterialEntry
  },

  {
    path: '/material/out',
    name: 'materialOut',
    component: MaterialOut
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
  ]
})

router.beforeEach((to, from, next) => {
  if (['/login'].includes(to.path)) {
    store.dispatch('navigator/updateNavigator', '/login')
    next()
  } else {
    if (isLogin()) {
      store.dispatch('navigator/updateNavigator', to.path)
      next()
    } else next('/login')
  }
})

export default router

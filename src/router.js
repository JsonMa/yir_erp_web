import Vue from 'vue'
import Router from 'vue-router'

import Material from './pages/material/Material.vue'
import MaterialEntry from './pages/material/MaterialEntry.vue'
import MaterialOut from './pages/material/MaterialOut.vue'
import Out from './components/common/MaterialOut.vue'
import Login from './pages/login/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'material',
    component: Out
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

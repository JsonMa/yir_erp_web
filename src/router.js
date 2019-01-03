import Vue from 'vue'
import Router from 'vue-router'

import Material from './pages/material/Material.vue'
import Login from './pages/login/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'material',
    component: Material
  },
  {
    path: '/material',
    name: 'material',
    component: Material
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
  ]
})

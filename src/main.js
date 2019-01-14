import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './element-variables.scss'
import axios from 'axios'

Vue.prototype.$moment = require('moment-timezone')
Vue.config.productionTip = false
Vue.use(ElementUI)

const axiosIns = axios.create({
  baseURL: 'http://127.0.0.1:7001/api',
  timeout: 3000,
  validateStatus: (status) => {
    return status >= 200 && status < 300
  }
})
axiosIns.interceptors.request.use((config) => {
  const userInfo = store.state.user.user || JSON.parse(window.localStorage.getItem('user'))
  if (userInfo) config.headers.common['access-token'] = userInfo.token || ''
  return config
})

axiosIns.interceptors.response.use((response) => {
  return response
}, (error) => {
  const {
    response
  } = error
  if (response.status === 403) {
    if (response.data.code === 4030001) {
      window.localStorage.removeItem('user')
      store.dispatch('user/updateUser', {})
      store.dispatch('navigator/updateNavigator', '/login')
      router.push('/login')
    } else return Promise.reject(error)
  }
})

Vue.prototype.$axios = axiosIns

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

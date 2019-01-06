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
Vue.prototype.$axios = axios.create({
  baseURL: 'http://127.0.0.1:7001/api',
  timeout: 1000
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

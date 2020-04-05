// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Element from 'element-ui'
import router from './router'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(Element)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
/**
 * 通过axios请求拦截器添加token，保证拥有获取数据的权限
 */
axios.interceptors.request.use(config => {
  // 将token添加到请求拦截器中，保证后续请求带上token字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

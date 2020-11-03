import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import sha1 from "js-sha1";

import axios from "axios"

// axios.defaults.baseURL="http://localhost:8801/wx"
axios.defaults.baseURL="http://49.235.208.156/wx"
// 响应拦截器
axios.interceptors.response.use((res)=>{
  let {data,headers,config}=res
  let url=config.url
  url=url.replace(config.baseURL,'')
  //登录成功时，在sessionStorage中保存token值
  if(data.code===200&&url==="/adminlogin"){
    let token=data.token
    sessionStorage.setItem("token",token)
  }
  return res
})

axios.interceptors.request.use((config)=>{
  if(config.url!=="/adminlogin"){
    config.headers.token=sessionStorage.getItem("token")
  }
  return config
})

Vue.prototype.$http=axios

Vue.prototype.$sha1=sha1;

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

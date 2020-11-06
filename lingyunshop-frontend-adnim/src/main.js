import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入axios
import axios from 'axios'
import qs from 'qs';
// 全局引入css与js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/plugins/bootstrap/css/bootstrap.min.css'
import '@/assets/plugins/adminLTE/css/AdminLTE.css'
import '@/assets/plugins/adminLTE/css/skins/_all-skins.min.css'
import '@/assets/css/style.css'
// 引入jq
import $ from 'jquery'
Vue.prototype.$ = $
import '@/assets/plugins/bootstrap/js/bootstrap.min.js'
import '@/assets/plugins/adminLTE/js/app.min.js'

Vue.prototype.$qs = qs;
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.axios = axios;
// 设置axios默认post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/bootstrap-vue'
import './plugins/axios'

Vue.config.productionTip = false

Vue.filter('toReal', (valor) => {
	return parseFloat(valor).toFixed(2);
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

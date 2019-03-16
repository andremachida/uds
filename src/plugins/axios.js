import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/'

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios

        Vue.prototype.$http.interceptors.request.use(config => {
            return config
        }, error => Promise.reject(error))
    }
})
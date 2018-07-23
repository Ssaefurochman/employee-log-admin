import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuelidate from 'vuelidate'
import Notifications from 'vue-notification';
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  theme: {
    primary: "#2e701f",
    secondary: "#29B6F6",
    accent: "#E65100",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  }
});
Vue.use(Vuelidate);
Vue.use(Notifications);
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL
Vue.axios.defaults.headers.common['Authorization'] = localStorage.getItem("access_token")
Vue.axios.defaults.timeout = 30000

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

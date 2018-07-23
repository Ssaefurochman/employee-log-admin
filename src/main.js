import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuelidate from 'vuelidate'
import Notifications from 'vue-notification';

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

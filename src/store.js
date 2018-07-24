import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import AuthModule from './modules/auth';
import LoginModule from './modules/login';
import DrawerModule from './modules/drawer';
import NotifyModule from './modules/notify';
import CategoryModule from './modules/category';

export default new Vuex.Store({
  modules: {
    auth: AuthModule,
    login: LoginModule,
    drawer: DrawerModule,
    notify: NotifyModule,
    category: CategoryModule,
  }
})

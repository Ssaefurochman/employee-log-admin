import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  isLoading: false,
  email: '',
  password: ''
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

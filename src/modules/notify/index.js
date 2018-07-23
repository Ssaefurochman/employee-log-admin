import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  show: false,
  title: '',
  text: '',
  type: '',
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

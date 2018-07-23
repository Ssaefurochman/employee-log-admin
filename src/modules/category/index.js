import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  loading: false,
  saveLoading: false,
  deleteLoading: false,
  datas: [],
  editedIndex: -1,
  editedItem: {
    name: '',
    parent: 0,
    is_active: 1
  },
  defaultItem: {
    name: '',
    parent: 0,
    is_active: 1
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

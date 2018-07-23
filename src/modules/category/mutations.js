export default {
  loading: state => {
    state.loading = true;
    state.datas = [];
  },
  saveLoading: state => {
    state.saveLoading = true;
  },
  deleteLoading: state => {
    state.deleteLoading = true;
  },
  setDatas: (state, payload) => {
    state.datas = payload;
    state.loading = false;
  },
  edit: (state, payload) => {
    state.editedIndex = state.datas.indexOf(payload);
    state.editedItem = Object.assign({}, payload);
  },
  delete: (state, payload) => {
    state.datas.splice(payload, 1);
    state.deleteLoading = false;
  },
  save: (state) => {
    if (state.editedIndex > -1) {
      // Edit Data
      Object.assign(state.datas[state.editedIndex], state.editedItem);
    } else {
      // Create New Data
      state.datas.push(state.editedItem);
    }

    state.saveLoading = false;
  },
  nameVal: (state, payload) => {
    state.editedItem.name = payload;
  },
  is_activeVal: (state, payload) => {
    state.editedItem.is_active = payload;
  },
  resetForm: (state) => {
    state.editedItem = Object.assign({}, state.defaultItem)
    state.editedIndex = -1;
  },
}

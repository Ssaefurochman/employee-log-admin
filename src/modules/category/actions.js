export default {
  FETCH_DATA: ({ commit }) => {
    //Use `fetch` or `axios` to send API Request.
    //For Simulation, use setTimeout()
    commit('loading');
    setTimeout(()=>{
      const results = [
        {
          name: 'Komputer',
          parent: 0,
          is_active: 1
        },
        {
          name: 'Makanan',
          parent: 0,
          is_active: 1
        },
        {
          name: 'Minuman',
          parent: 0,
          is_active: 1
        },
      ];
      commit('setDatas', results);
    }, 3000);
  },
  SAVE_DATA: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit('saveLoading');
      setTimeout(() => {
        commit('save');
        resolve(true);
      }, 3000);
    });
  },
  DELETE_DATA: ({ commit }, payload) => {
    return new Promise ((resolve, reject) => {
      commit('deleteLoading');
      setTimeout(() => {
        commit('delete', payload);
        resolve(true);
      }, 3000);
    });
  },
  SOFTDELETE_DATA: ({ commit, state }, payload) => {
    setTimeout(() => {
      commit('edit', payload);
      commit('is_activeVal', !state.editedItem.is_active);
      commit('save');
      return Promise.resolve(true);
    },300);
  },
}

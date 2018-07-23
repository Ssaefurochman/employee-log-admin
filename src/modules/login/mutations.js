export default {
  emailVal: (state, payload) => {
    state.email = payload;
  },
  passwordVal: (state, payload) => {
    state.password = payload;
  },
  toggleLoading: (state, payload) => {
    state.isLoading = payload;
  },
  reset: (state) => {
    // state.email = '';
    state.password = '';
    state.isLoading = false;
  }
}

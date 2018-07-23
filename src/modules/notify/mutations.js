export default {
  showNotify: (state, { title, text, type }) => {
    state.show = true;
    state.title = title;
    state.text = text;
    state.type = type;
  },
  disableNotify: state => {
    state.show = false;
    state.title = '';
    state.text = '';
    state.type = '';
  }
}

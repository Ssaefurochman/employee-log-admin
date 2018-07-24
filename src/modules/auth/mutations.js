export default {
  setAuthData: (state, { userData, userId, accessToken }) => {
    state.userData = userData;
    state.userId = userId;
    state.accessToken = accessToken;
  },
  destroyAuthData: (state) => {
    state = {
      userData: null,
      accessToken: null,
      userId: null
    }
  }
}

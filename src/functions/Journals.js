import Vue from 'vue';

export default {
  getJournal: (accessToken) => {
    return Vue.axios.get('/journals', {
      params: {
        access_token: accessToken
      }
    });
  }
};

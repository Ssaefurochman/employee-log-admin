import Vue from 'vue';

export default {
  getJournal: (accessToken, userId) => {
    return Vue.axios.get('/journals', {
      params: {
        access_token: accessToken,
        filter: {
          where: { user_id: userId }
        }
      }
    });
  }
};

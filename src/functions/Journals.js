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
  },
  insertJournal: (accessToken, formData) => {
    return Vue.axios.post('/journals', formData, {
      params: {
        access_token: accessToken
      }
    });
  },
  editJournal: (accessToken, formData, journalId) => {
    // Bisa digunakan untuk Edit data / Soft Delete
    return Vue.axios.patch(`/journals/${journalId}`, formData, {
      params: {
        access_token: accessToken
      }
    })
  },
  deleteJournal: (accessToken, journalId) => {
    return Vue.axios.delete(`/journals/${journalId}`, {
      params: {
        access_token: accessToken
      }
    })
  }
};

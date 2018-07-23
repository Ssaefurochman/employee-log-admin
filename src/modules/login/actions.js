import Vue from 'vue';
import router from '../../router';

export default {
  loginAction: async (context, {email, password}) => {
    try {
      let { data } = await Vue.axios.post(`/users/login`, { email, password });
      let { data: userData } = await Vue.axios.get(`/users/${data.userId}`, {
        params: {
          access_token: data.id,
          filter: {
            include: 'role'
          }
        }
      });

      const role = userData.role[0];

      localStorage.setItem('access_token', data.id);
      localStorage.setItem('user_id', data.userId);
      localStorage.setItem('ttl', data.ttl);
      localStorage.setItem('role', role.name);
      context.commit('reset');
      router.push('/');
    } catch (e) {
      console.log(e);
      context.commit('reset');
      context.commit('notify/showNotify', {
        title: 'Login Failed',
        text: 'Wrong Email or Password',
        type: 'error'
      }, { root: true });
    }
  }
}

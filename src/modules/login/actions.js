import Vue from 'vue';
import router from '../../router';

export default {
  loginAction: async (context, {email, password}) => {
    try {
      let { data } = await Vue.axios.post(`/users/login`, { email, password });
      console.log(data);
      localStorage.setItem('access_token', data.id);
      localStorage.setItem('user_id', data.userId);
      localStorage.setItem('ttl', data.ttl);
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


    //Well, this is just a simulation...so...deal with it *Put on black glasses*
    // setTimeout(() => {
    //   if (email == 'admin@admin.com' && password == 'admin') {
    //     localStorage.setItem('access_token', 'lololololololo');
    //     localStorage.setItem('user_id', 1);
    //     context.commit('reset');
    //     router.push('/');
    //   } else {
    //     context.commit('reset');
    //     context.commit('notify/showNotify', {
    //       title: 'Login Failed',
    //       text: 'Wrong Email or Password',
    //       type: 'error'
    //     }, { root: true });
    //   }
    // }, 3000);
  }
}

import router from '../../router';

export default {
  loginAction: (context, {email, password}) => {
    //Well, this is just a simulation...so...deal with it *Put on black glasses*
    setTimeout(() => {
      if (email == 'admin@admin.com' && password == 'admin') {
        localStorage.setItem('access_token', 'lololololololo');
        localStorage.setItem('user_id', 1);
        context.commit('reset');
        router.push('/');
      } else {
        context.commit('reset');
        context.commit('notify/showNotify', {
          title: 'Login Failed',
          text: 'Wrong Email or Password',
          type: 'error'
        }, { root: true });
      }
    }, 3000);
  }
}

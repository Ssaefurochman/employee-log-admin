<template>
  <v-app id="inspire">
    <NavigationDrawer />
    <Toolbar />
    <v-content>
      <v-container
        fluid
        fill-height
        tag="section"
      >
        <!-- <v-layout justify-center align-center> -->
        <v-layout row wrap>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <!-- <Form/> -->
    <notifications group="notification" position="bottom right"/>
  </v-app>
</template>

<script>
  import NavigationDrawer from './components/NavigationDrawer.vue';
  import Toolbar from './components/Toolbar.vue';
  import FormBoilerplate from './components/FormBoilerplate.vue';
  export default {
    data: () => ({

    }),
    created () {
      console.log('App Created', this.accessToken);

      if (!this.accessToken) {
        // Set global auth state on page refresh

        const accessToken = localStorage.getItem("access_token");
        const userData = JSON.parse(localStorage.getItem("user_data"));
        const userId = localStorage.getItem("user_id");

        this.$store.commit('auth/setAuthData', { userData, userId, accessToken });

        console.log('auth data is set', this.$store.state.auth);
      }
    },
    computed: {
      accessToken () {
        return this.$store.state.auth.accessToken
      }
    },
    components: {
      NavigationDrawer,
      Toolbar,
      Form: FormBoilerplate
    },
    props: {
      source: String
    }
  }
</script>

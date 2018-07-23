<template>
  <v-toolbar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    color="primary"
    dark
    app
    fixed
  >
    <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="toggleDrawer(!drawer)"></v-toolbar-side-icon>
      <span class="hidden-sm-and-down">Ranggo CMS</span>
    </v-toolbar-title>
    <v-text-field
      flat
      solo-inverted
      prepend-icon="search"
      label="Search"
      class="hidden-sm-and-down"
    ></v-text-field>
    <v-spacer></v-spacer>
    <!-- <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn> -->
    <v-menu offset-y>
      <v-btn slot="activator" icon dark>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click="logout">
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>


  </v-toolbar>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  computed: {
    drawer(){
      return this.$store.state.drawer.show;
    }
  },
  methods: {
    ...mapMutations('drawer', [
      'toggleDrawer'
    ]),
    logout(){
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      return this.$router.push('/login');
    }
  }
}
</script>

<style lang="css">
</style>

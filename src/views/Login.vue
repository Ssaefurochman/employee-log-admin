<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Please Login to Continue</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-form>
                <v-card-text>
                  <v-text-field
                    prepend-icon="person"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    required
                    :error-messages="emailErrors"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    required
                    :error-messages="passwordErrors"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    type="submit"
                    :loading="isLoading"
                    :disabled="isLoading"
                    color="primary"
                    @click="login"
                  >
                    Login
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <notifications group="notification" position="bottom right"/>
  </v-app>
</template>

<script>
  import { required, email } from 'vuelidate/lib/validators';
  import { mapState, mapMutations } from 'vuex';

  export default {
    validations: {
      email: { required, email },
      password: { required }
    },
    data: () => ({

    }),
    methods: {
      ...mapMutations('notify', [
        'disableNotify'
      ]),
      login(e) {
        e.preventDefault();

        this.$v.$touch();
        if (this.$v.$invalid) {
          console.log('validation error');
        } else {
          this.$store.commit('login/toggleLoading', !this.isLoading);
          this.$store.dispatch('login/loginAction', { email: this.email, password: this.password });
        }
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.login.isLoading,
        showNotify: state => state.notify.show
      }),
      email: {
        get(){
          return this.$store.state.login.email;
        },
        set(value){
          this.$store.commit('login/emailVal', value);
        }
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
      password: {
        get(){
          return this.$store.state.login.password;
        },
        set(value){
          this.$store.commit('login/passwordVal', value);
        }
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Password is required')
        return errors
      }
    },
    watch: {
      showNotify(){
        if (this.showNotify) {
          this.$notify({
            title: this.$store.state.notify.title,
            text: this.$store.state.notify.text,
            type: this.$store.state.notify.type,
            group: 'notification',
          });
        }
        this.disableNotify();
      }
    }
  }
</script>

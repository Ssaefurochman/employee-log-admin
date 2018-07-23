<template>
  <v-flex>
    <v-flex tag="h1" class="headline">Categories</v-flex>

    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
      <v-card>
        <v-card-title>Delete Confirmation</v-card-title>
        <v-card-text>
          Are you sure want to delete this data ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-if="deleteLoading">
            <v-progress-circular indeterminate color="green"></v-progress-circular>
          </div>
          <div v-else>
            <v-btn color="blue darken-1" flat @click.stop="dialogDelete=false">Cancel</v-btn>
            <v-btn type="submit" color="blue darken-1" flat @click.stop="deleteItem">Delete</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-btn
        fixed
        slot="activator"
        color="primary"
        dark
        fab
        bottom
        right
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-form>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                  <v-text-field
                    v-model="name"
                    :error-messages="nameErrors"
                    required
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                    label="Category Name"
                  >
                  </v-text-field>
                <!-- <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                </v-flex> -->
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div v-if="saveLoading">
              <v-progress-circular indeterminate color="green"></v-progress-circular>
            </div>
            <div v-else>
              <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
              <v-btn type="submit" color="blue darken-1" flat @click.native="save">Save</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="datas"
      class="elevation-1"
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.parent }}</td>
        <!-- <td class="text-xs-right">{{ props.item.is_active }}</td> -->
        <td class="text-xs-right">
          <v-switch label="" :input-value="props.item.is_active" @change="softDeleteItem(props.item)" ></v-switch>
        </td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click.stop="dialogDelete = true; itemWillBeDeleted = props.item;">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { mapState, mapActions, mapMutations } from 'vuex';
import { required, maxLength, email } from 'vuelidate/lib/validators';

export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      itemWillBeDeleted: {},
      headers: [
        { text: 'No', value: 'no' },
        { text: 'Category Name', value: 'name' },
        { text: 'Parent Category', value: 'parent' },
        { text: 'Is Active', value: 'is_active' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
    }),
    validations: {
      name: { required }
    },
    computed: {
      ...mapState({
        loading: state => state.category.loading,
        saveLoading: state => state.category.saveLoading,
        deleteLoading: state => state.category.deleteLoading,
        datas: state => state.category.datas,
        editedIndex: state => state.category.editedIndex,
        defaultItem: state => state.category.defaultItem,
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'New Data' : 'Edit Data'
      },
      name: {
        get(){
          return this.$store.state.category.editedItem.name;
        },
        set(val){
          this.nameVal(val);
        }
      },
      nameErrors () {
        const errors = [];
        if (!this.$v.name.$dirty) return errors;
        !this.$v.name.required && errors.push('Name is required.');
        return errors;
      },
    },

    watch: {
      dialog (val) {
        val || this.close();
      },
      dialogDelete (val) {
        if (!val) this.itemWillBeDeleted = {};
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      ...mapActions('category',[
        'FETCH_DATA',
        'SAVE_DATA',
        'DELETE_DATA',
        'SOFTDELETE_DATA'
      ]),
      ...mapMutations('category',[
        'edit',
        'nameVal',
        'resetForm'
      ]),
      initialize () {
        this.FETCH_DATA();
      },
      editItem (item) {
        this.edit(item);
        this.dialog = true;
      },
      softDeleteItem(item){
        this.SOFTDELETE_DATA(item).then(success => success && this.resetForm());
      },
      deleteItem () {
        const index = this.datas.indexOf(this.itemWillBeDeleted);
        this.DELETE_DATA(index).then(success => success && (this.dialogDelete = false));
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.resetForm();
        }, 300)
      },

      save (e) {
        e.preventDefault();

        this.$v.$touch();
        if (this.$v.$invalid) {
          console.log('validation error');
        } else {
          this.SAVE_DATA().then((success) => {
            if (success) this.close();
          });
        }
      }
    }
  }
</script>

<template>
  <v-flex>
    <v-flex tag="h1" class="headline">Data Jurnal Pegawai</v-flex>

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
            <v-text-field
              v-model="editedItem.title"
              box
              color="deep-purple"
              label="Judul Jurnal"
              type="text"
              prepend-icon="title"
            ></v-text-field>
            <v-textarea
              v-model="editedItem.description"
              name="input-7-1"
              box
              label="Deskripsi"
              auto-grow
              prepend-icon="description"
            ></v-textarea>
            <v-menu
              ref="dateMenu"
              :close-on-content-click="false"
              v-model="datePickerMenu"
              :nudge-right="40"
              :return-value.sync="editedItem.date"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                box
                slot="activator"
                v-model="editedItem.date"
                label="Tanggal"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="editedItem.date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="datePickerMenu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dateMenu.save(editedItem.date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="timePickerMenu"
              :close-on-content-click="false"
              v-model="timePickerMenu"
              :nudge-right="40"
              :return-value.sync="editedItem.time"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="editedItem.time"
                label="Pukul"
                prepend-icon="access_time"
                readonly
              ></v-text-field>
              <v-time-picker
                v-if="timePickerMenu"
                v-model="editedItem.time"
                @change="$refs.timePickerMenu.save(editedItem.time)"
                format="24hr"
              ></v-time-picker>
            </v-menu>
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
        <td></td>
        <td class="text-xs-right"></td>
        <td class="text-xs-right"></td>
        <td class="text-xs-right">
          <!-- <v-switch label="" :input-value="props.item.is_active" @change="softDeleteItem(props.item)" ></v-switch> -->
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
  import { mapState } from 'vuex';
  import journalAPI from '../functions/Journals';
  const { getJournal } = journalAPI;

  export default {
    data: () => ({
      datePickerMenu: false,
      timePickerMenu: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'No',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Judul Jurnal', value: 'calories' },
        { text: 'Tanggal', value: 'fat' },
        { text: 'Pukul', value: 'carbs' },
        { text: 'Dibuat Tanggal', value: 'protein' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      loading: false,
      saveLoading: false,
      deleteLoading: false,
      datas: [],
      editedIndex: -1,
      editedItem: {
        title: '',
        description: '',
        date: '',
        time: null
      },
      defaultItem: {
        title: '',
        description: '',
        date: '',
        time: null
      }
    }),
    computed: {
      ...mapState('auth', {
        accessToken: state => state.accessToken
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'Data Baru' : 'Edit Data'
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
        val || this.close()
      }
    },
    created () {
      this.loadData();
    },
    methods: {
      async loadData () {
        console.log(this.accessToken);
        let { data } = await getJournal(this.accessToken);
        this.datas = data;
      },
      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>

<template>
  <v-flex>
    <v-flex tag="h1" class="headline">Data Jurnal Pegawai</v-flex>

    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
      <v-card>
        <v-card-title>Konfirmasi hapus</v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data ini ?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-if="deleteLoading">
            <v-progress-circular indeterminate color="green"></v-progress-circular>
          </div>
          <div v-else>
            <v-btn color="blue darken-1" flat @click.stop="close">Cancel</v-btn>
            <v-btn type="submit" color="blue darken-1" flat @click.stop="deleteRequest">Delete</v-btn>
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
              :error-messages="titleErrors"
              @input="$v.editedItem.title.$touch()"
              @blur="$v.editedItem.title.$touch()"
            ></v-text-field>
            <v-textarea
              v-model="editedItem.description"
              name="input-7-1"
              box
              label="Deskripsi"
              auto-grow
              prepend-icon="description"
              :error-messages="descErrors"
              @input="$v.editedItem.description.$touch()"
              @blur="$v.editedItem.description.$touch()"
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
                :error-messages="dateErrors"
                @input="$v.editedItem.date.$touch()"
                @blur="$v.editedItem.date.$touch()"
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
                :error-messages="timeErrors"
                @input="$v.editedItem.time.$touch()"
                @blur="$v.editedItem.time.$touch()"
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
              <v-btn type="submit" color="blue darken-1" flat @click.prevent="validate">Save</v-btn>
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
        <td class="text-xs-right">{{ props.item.title }}</td>
        <td class="text-xs-right">{{ formatDate(props.item.date) }}</td>
        <td class="text-xs-right">{{ props.item.time }}</td>
        <td>{{ formatDate(props.item.created_at) }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click.stop="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
  import { mapState } from 'vuex';
  import { required } from 'vuelidate/lib/validators';
  import moment from 'moment';
  import journalAPI from '../functions/Journals';
  const { getJournal, insertJournal, editJournal, deleteJournal } = journalAPI;

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
        { text: 'Judul Jurnal', value: 'title' },
        { text: 'Tanggal', value: 'date' },
        { text: 'Pukul', value: 'time' },
        { text: 'Dibuat Tanggal', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      loading: false,
      saveLoading: false,
      deleteLoading: false,
      datas: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        title: '',
        description: '',
        date: '',
        time: null
      },
      defaultItem: {
        id: null,
        title: '',
        description: '',
        date: '',
        time: null
      }
    }),
    computed: {
      ...mapState('auth', {
        accessToken: state => state.accessToken,
        userId: state => state.userId
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'Data Baru' : 'Edit Data'
      },
      titleErrors () {
        const errors = [];
        if (!this.$v.editedItem.title.$dirty) return errors;
        !this.$v.editedItem.title.required && errors.push('Judul tidak boleh kosong!');
        return errors;
      },
      descErrors () {
        const errors = [];
        if (!this.$v.editedItem.description.$dirty) return errors;
        !this.$v.editedItem.description.required && errors.push('Deskripsi tidak boleh kosong!');
        return errors;
      },
      dateErrors () {
        const errors = [];
        if (!this.$v.editedItem.date.$dirty) return errors;
        !this.$v.editedItem.date.required && errors.push('Tanggal tidak boleh kosong!');
        return errors;
      },
      timeErrors () {
        const errors = [];
        if (!this.$v.editedItem.time.$dirty) return errors;
        !this.$v.editedItem.time.required && errors.push('Pukul tidak boleh kosong!');
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
    validations: {
      editedItem: {
        title: { required },
        description: { required },
        date: { required },
        time: { required }
      }
    },
    methods: {
      async loadData () {
        let { data } = await getJournal(this.accessToken, this.userId);
        this.datas = data;
      },
      formatDate (date) {
        return moment(date).format('DD MMMM YYYY');
      },
      editItem (item) {
        this.editedIndex = this.datas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {               
        this.editedIndex = this.datas.indexOf(item);
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true;        
        
        // confirm('Are you sure you want to delete this item?') && this.datas.splice(index, 1)
      },
      close () {
        this.dialog = false;
        this.dialogDelete = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async postData () {
        // POST Request
        try {
          const formData = {
            ...this.editedItem,
            user_id: this.userId
          }
          let { data } = await insertJournal(this.accessToken, formData);
          this.datas.push(data)
        } catch (e) {
          console.log(e);
        }
      },
      patchData () {
        // PATCH Request
      },
      async deleteRequest () {
        // DELETE Request
        try {
          await deleteJournal(this.accessToken, this.editedItem.id);
          this.datas.splice(this.editedIndex, 1);
          this.close();
        } catch (e) {
          console.log(e);
        }
      },
      validate () {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          console.log('validation success');
          this.save();
        }
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.datas[this.editedIndex], this.editedItem)
        } else {
          this.postData();
        }
        this.$v.$reset()
        this.close()
      }
    }
  }
</script>

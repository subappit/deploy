<template>
  <q-table
    :data="data"
    :columns="columns"
    row-key="name"
    bordered
    :hide-bottom="true"
    :filter="filter"
    :filter-method="customFilter"
    separator="cell"
    :pagination="pagination"
  >
    <template v-slot:top="props">
      <q-input borderless dense debounce="300" v-model="search" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <div v-if="allRdos && !userLogged.admin" class="text-center" style="margin: auto; font-size: 1.2rem; color: #165081;">RDO di tuo interesse</div>
      <div v-if="!allRdos" class="text-center" style="margin: auto; font-size: 1.2rem; color: #165081;">RDO da te caricate</div>
      <div  class="q-ml-auto">
        <q-btn v-if="!allRdos"
               push
               :ripple="false"
               label="Carica RDO"
               @click="loadRdo()"
               color="accent">
        </q-btn>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <!-- <q-td :auto-width="true" key="rdos" :props="props">
         <div v-for="(rdo, index) in props.row.rdo.rdos" :key="index" >
            {{rdo.description}}
          </div>
        </q-td>-->
        <q-td :auto-width="true" key="macroCategory" :props="props">
          {{ props.row.rdo.rdos.descMacro }}
        </q-td>
        <q-td style="white-space: normal" :auto-width="true" key="subCategory" :props="props">
          {{ props.row.rdo.rdos.description }}
        </q-td>
        <q-td :auto-width="true" key="import" :props="props">
          {{ props.row.rdo.import }}
        </q-td>
        <q-td :auto-width="true" key="regionOfInterest" :props="props">
          {{ props.row.rdo.regionOfInterest.description }}
        </q-td>
        <q-td :auto-width="true" key="expirationDate" :props="props">
          {{ date.formatDate(props.row.rdo.expirationDate, 'DD-MM-YYYY') }}
        </q-td>
        <q-td :auto-width="true" key="viewRdo" :props="props">
          <q-icon style="font-size: 2rem;" name="search" @click="openRdo(props.row.rdo)" class="text-accent cursor-pointer"></q-icon>
        </q-td>
        <q-td v-if="userLogged.admin" :auto-width="true" key="appaltatore" :props="props">
          {{ props.row.rdo.contractor }}
        </q-td>
        <q-td v-if="!allRdos || userLogged.admin" :auto-width="true" key="deleteRdo" :props="props">
          <q-icon style="font-size: 2rem;" name="delete_forever" class="text-negative cursor-pointer" @click="cancelRdo(props.row.rdo)"></q-icon>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'TableRdo',
  props: ['allRdos', 'filtered'],
  data () {
    return {
      pagination: {
        rowsPerPage: 0
      },
      search: '',
      columns: [
        { name: 'macroCategory', required: true, label: 'Macrocategoria', align: 'center' },
        { name: 'subCategory', required: true, label: 'Subcategoria', align: 'center' },
        { name: 'import', required: true, label: 'Importo', align: 'center' },
        { name: 'regionOfInterest', required: true, label: 'Regione', align: 'center' },
        { name: 'expirationDate', required: true, label: 'Scadenza', align: 'center' },
        { name: 'viewRdo', required: true, label: 'Visualizza RDO', align: 'center' }
      ],
      data: [],
      date: date
    }
  },
  methods: {
    ...mapActions([
      'deleteRdo',
      'fetchUser',
      'fetchAllRdos'
    ]),
    getData (data) {
      if (this.data && this.data.length > 0) {
        this.data = []
      }
      data.forEach((rdo) => {
        const obj = {
          rdo: rdo
        }
        this.data.push(obj)
      })
    },
    openRdo (rdo) {
      this.$emit('openSelectedRdo', rdo)
    },
    loadRdo () {
      this.$emit('resetSelectedRdo')
      this.$emit('openModal')
    },
    async cancelRdo (rdo) {
      this.$q.loading.show()
      const userId = !this.userLogged.admin ? this.userLogged._id : rdo.user._id
      const objDelete = {
        pathParam: rdo._id + '/' + userId
      }
      const objUser = {
        pathParam: userId
      }
      await this.deleteRdo(objDelete)
      if (!this.userLogged.admin) {
        await this.fetchUser(objUser)
        this.getData(this.userLogged.loadedRdos)
      } else {
        await this.fetchAllRdos()
        const filteredRdos = !this.filtered ? this.boardRdos.filter((rdo) => { return rdo.user._id !== this.userLogged._id }) : this.boardFilteredRdos.filter((rdo) => { return rdo.user._id !== this.userLogged._id })
        this.getData(filteredRdos)
      }
      this.$q.loading.hide()
    },
    customFilter (rows, terms) {
      const lowerSearch = terms.search ? terms.search.toLowerCase() : ''

      const filteredRows = rows.filter(
        (row, i) => {
          let ans = false
          let s1 = true

          if (lowerSearch !== '') {
            s1 = false
            const searchObj = { }
            Object.entries(row.rdo).forEach((obj) => {
              if (obj[0] === 'rdos') {
                searchObj.descMacro = obj[1].descMacro
                searchObj.subCategory = obj[1].description
              }
              if (obj[0] === 'regionOfInterest') {
                searchObj[obj[0]] = obj[1].description
              }
              if (obj[0] === 'import') {
                searchObj[obj[0]] = obj[1]
              }
            })

            const s1Values = Object.values(searchObj)

            const s1Lower = s1Values.map(x => x.toString().toLowerCase())

            for (let val = 0; val < s1Lower.length; val++) {
              if (s1Lower[val].includes(lowerSearch)) {
                s1 = true
                break
              }
            }
          }

          ans = false
          if (s1) {
            ans = true
          }

          return ans
        })

      return filteredRows
    }
  },
  computed: {
    ...mapGetters({
      userLogged: 'user',
      boardRdos: 'boardRdos',
      boardFilteredRdos: 'boardFilteredRdos'
    }),
    filter () {
      return {
        search: this.search
      }
    }
  },
  mounted () {
    if (!this.allRdos) {
      this.getData(this.userLogged.loadedRdos)
      this.columns.push({ name: 'deleteRdo', required: true, label: 'Elimina RDO', align: 'center' })
    } else {
      if (this.userLogged.admin) {
        this.columns.push({ name: 'appaltatore', required: true, label: 'Appaltatore', align: 'center' })
        this.columns.push({ name: 'deleteRdo', required: true, label: 'Elimina RDO', align: 'center' })
      }
      const filteredRdos = !this.filtered ? this.boardRdos.filter((rdo) => { return rdo.user._id !== this.userLogged._id }) : this.boardFilteredRdos.filter((rdo) => { return rdo.user._id !== this.userLogged._id })
      this.getData(filteredRdos)
    }
  },
  watch: {
    boardRdos: {
      deep: true,
      handler (newVal, oldVal) {
        if (this.allRdos) {
          const filteredRdos = newVal.filter((rdo) => { return rdo.user._id !== this.userLogged._id })
          this.getData(filteredRdos)
        }
      }
    },
    boardFilteredRdos: {
      deep: true,
      handler (newVal, oldVal) {
        if (this.allRdos) {
          const filteredRdos = newVal.filter((rdo) => { return rdo.user._id !== this.userLogged._id })
          this.getData(filteredRdos)
        }
      }
    },
    userLogged: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal && !this.allRdos) {
          this.getData(newVal.loadedRdos)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>

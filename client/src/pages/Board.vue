<template>
  <q-page v-if="userLogged && allLoaded">
    <div class="q-py-lg tab-rdo">
      <q-tabs
        v-if="!userLogged.admin"
        v-model="tab"
        class="text-secondary"
        active-color="accent"
        indicator-color="accent"
        dense
        narrow-indicator
        align="center"
      >
        <q-tab :ripple="false" name="rdos" label="RDO di tuo interesse" class="q-mr-lg"/>
        <q-tab :ripple="false" name="yourRdos" label="Rdo da te caricate" class="q-ml-lg" />
      </q-tabs>

      <h5 v-if="userLogged.admin" class="text-center no-margin">Lista RDO vista ADMIN</h5>
      <div>
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="full-width"
        >
          <q-tab-panel name="rdos">
            <div v-if="(userLogged.admin && boardRdosLoaded)" >
              <div class="q-pa-lg">
                <table-rdo @resetSelectedRdo="selectedRdo= null" @openSelectedRdo="openSelectedRdo" @openModal="openModal('load-rdo', 'Carica RDO', true, loadRdoClassObj, false)" :allRdos="true" :filtered="false"></table-rdo>
              </div>
            </div>
            <div v-if="(!userLogged.admin && boardFilteredRdosLoaded)" >
              <div class="q-pa-lg">
                <table-rdo @resetSelectedRdo="selectedRdo= null" @openSelectedRdo="openSelectedRdo" @openModal="openModal('load-rdo', 'Carica RDO', true, loadRdoClassObj, false)" :allRdos="true" :filtered="true"></table-rdo>
              </div>
            </div>
            <div v-if="userLogged.admin && !boardRdosLoaded" class="flex column justify-center items-center q-pt-xl" >
              <h5 class="text-center no-margin q-pb-lg">Nessuna RDO trovata</h5>
            </div>
            <div v-if="!userLogged.admin && !boardFilteredRdosLoaded" class="flex column justify-center items-center q-pt-xl" >
              <h5 class="text-center no-margin q-pb-lg">Nessuna RDO trovata corrispondente ai parametri da te scelti in fase di registrazione</h5>
            </div>
            <modal :selected-rdo="selectedRdo" :class-obj="classObj" :modal.sync="modal" :is-maximized="isMaximized" :component="modalComponent" :title="modalTitle"/>
          </q-tab-panel>

          <q-tab-panel name="yourRdos">
            <user-rdos></user-rdos>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TableRdo from 'components/TableRdo'
import Modal from 'components/Modal'
import UserRdos from 'components/UserRdos'

export default {
  name: 'Board',
  components: { UserRdos, TableRdo, Modal },
  data () {
    return {
      tab: 'rdos',
      loadRdoClassObj: {
        'q-pa-none': true
      },
      modalComponent: undefined,
      modalTitle: undefined,
      isMaximized: false,
      modal: false,
      classObj: {},
      boardRdosLoaded: true,
      boardFilteredRdosLoaded: true,
      selectedRdo: null,
      allLoaded: false
    }
  },
  methods: {
    ...mapActions([
      'fetchFilteredRdos',
      'fetchAllRdos',
      'fetchUser'
    ]),
    openModal (component, title, isMaximized, classObj) {
      this.modalComponent = component
      this.modalTitle = title
      this.isMaximized = isMaximized
      this.modal = true
      this.classObj = classObj
    },
    openSelectedRdo (rdo) {
      this.selectedRdo = rdo
      this.openModal('load-rdo', 'RDO di ' + rdo.contractor, true, this.loadRdoClassObj, false)
    },
    async loadBoard () {
      if (this.userLogged && !this.userLogged.admin) {
        await this.fetchFilteredRdos(this.getFilters())
        const obj = { pathParam: this.userLogged._id }
        await this.fetchUser(obj)
        this.boardFilteredRdosLoaded = this.boardFilteredRdos.length > 0
        this.allLoaded = true
      } else if (this.userLogged && this.userLogged.admin) {
        await this.fetchAllRdos()
        this.boardRdosLoaded = this.boardRdos.length > 0
        this.allLoaded = true
      }
      this.$q.loading.hide()
    },
    getFilters () {
      const rdoIdsFirst = [], importsFirst = [], rofIdsFirst = [], rdoIdsSecond = [], importsSecond = [], rofIdsSecond = [], rdoIdsThird = [], importsThird = [], rofIdsThird = []
      Object.entries(this.userLogged.rdos).forEach((obj) => {
        if (obj[0] === 'first') {
          obj[1].subCategory.forEach((rdo) => {
            rdoIdsFirst.push(rdo._id)
          })
          obj[1].imports.forEach((imp) => {
            importsFirst.push(imp)
          })
          obj[1].regionsOfInterest.forEach((rof) => {
            rofIdsFirst.push(rof._id)
          })
        }
        if (obj[0] === 'second') {
          obj[1].subCategory.forEach((rdo) => {
            rdoIdsSecond.push(rdo._id)
          })
          obj[1].imports.forEach((imp) => {
            importsSecond.push(imp)
          })
          obj[1].regionsOfInterest.forEach((rof) => {
            rofIdsSecond.push(rof._id)
          })
        }
        if (obj[0] === 'third') {
          obj[1].subCategory.forEach((rdo) => {
            rdoIdsThird.push(rdo._id)
          })
          obj[1].imports.forEach((imp) => {
            importsThird.push(imp)
          })
          obj[1].regionsOfInterest.forEach((rof) => {
            rofIdsThird.push(rof._id)
          })
        }
      })
      const obj = {
        queryparams: {
          regionOfInterestIdFirst: rofIdsFirst,
          rdoIdFirst: rdoIdsFirst,
          importsFirst: importsFirst
        }
      }
      if (rdoIdsSecond.length > 0) {
        obj.queryparams.regionOfInterestIdSecond = rofIdsSecond
        obj.queryparams.rdoIdSecond = rdoIdsSecond
        obj.queryparams.importsSecond = importsSecond
      }
      if (rdoIdsThird.length > 0) {
        obj.queryparams.regionOfInterestIdThird = rofIdsThird
        obj.queryparams.rdoIdThird = rdoIdsThird
        obj.queryparams.importsThird = importsThird
      }
      return obj
    }
  },
  computed: {
    ...mapGetters({
      userLogged: 'user',
      boardRdos: 'boardRdos',
      boardFilteredRdos: 'boardFilteredRdos'
    })
  },
  watch: {
    boardRdos: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.boardRdosLoaded = newVal.length > 0
        }
      }
    },
    boardFilteredRdos: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.boardFilteredRdosLoaded = newVal.length > 0
        }
      }
    }
  },
  async mounted () {
    this.$q.loading.show()
    if (!this.userLogged) {
      const userId = window.localStorage.getItem('userId')
      if (userId) {
        const obj = { pathParam: userId }
        await this.fetchUser(obj)
      }
    }
    await this.loadBoard()
  }
}
</script>

<style scoped>
</style>

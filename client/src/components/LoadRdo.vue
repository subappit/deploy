<template>
  <q-form @submit="loadRdo">
    <div class="row wrap justify-center content-center q-pt-lg no-margin q-gutter-x-md q-gutter-y-xs">

      <q-input   outlined
                 :disable="true"
                 v-model="rdo.contractor"
                 type="text"
                 label="Appaltatore *"
                 class="col-12 col-md-3"
                 reactive-rules name="contractor"
                 :rules="[ (val) => isValid('contractor', val, $v.rdo) ]"/>

      <div class="desktop-only col-md-3"></div>
      <div class="desktop-only col-md-3"></div>

      <!-- Riga -->

      <q-input   outlined
                 label="Descrizione *"
                 class="col-12 col-md-3 "
                 type="textarea"
                 name="description"

                 v-model="rdo.description"
                 :disable="selectedRdo != null"
                 reactive-rules
                 :rules="[ (val) => isValid('description', val, $v.rdo) ]" >
        <template v-slot:append>
          <q-icon class="desktop-only text-secondary" name="info">
            <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
              Fornisci una breve descrizione dell’appalto
            </q-tooltip>
          </q-icon>
        </template>
      </q-input>

      <q-input   outlined
                 label="Documenti necessari"
                 class="col-12 col-md-3"
                 type="textarea"
                 name="requiredDocuments"
                 :disable="selectedRdo != null"
                 v-model="rdo.requiredDocuments"
                 reactive-rules
                 :rules="[ (val) => {return true} ]" >
        <template v-slot:append>
          <q-icon class="desktop-only text-secondary" name="info">
            <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
              Indica se vi sono documenti di primaria importanza ai fini del subappalto
            </q-tooltip>
          </q-icon>
        </template>
      </q-input>

      <q-input   outlined
                 label="Eventuali problematiche o peculiarità"
                 class="col-12 col-md-3"
                 type="textarea"
                 name="peculiarity"
                 :disable="selectedRdo != null"
                 v-model="rdo.peculiarity"
                 reactive-rules
                 :rules="[ (val) => {return true} ]" >
        <template v-slot:append>
          <q-icon class="desktop-only text-secondary" name="info">
            <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
              Indica se vi sono problematiche o peculiarità di cui il subappaltatore dovrà tenere conto nella formulazione dell’offerta
            </q-tooltip>
          </q-icon>
        </template>
      </q-input>

      <!-- Riga -->

      <q-input @click="$refs.qDateProxy.show()"
               onkeydown="return false"
               :disable="selectedRdo != null"
               class="col-12 col-md-3" label="Data scadenza *"
               :rules="[ (val) => isValid('expirationDate', val, $v) ]"
               outlined v-model="expirationDate" mask="##/##/####">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date :readonly="selectedRdo" @input="resetStartEndDate"  :locale="currentLocale" v-model="expirationDate" :options="calendarDataScadenza"  mask="DD/MM/YYYY">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Annulla" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
          <q-icon class="desktop-only text-secondary" name="info">
            <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
              Termine entro il quale presentare l'offerta (massimo 30 giorni)
            </q-tooltip>
          </q-icon>
        </template>
      </q-input>

      <q-input @click="$refs.startDateProxy.show()"
               onkeydown="return false"
               :disable="selectedRdo != null || expirationDate == null"
               class="col-12 col-md-3" label=" Data prevista per inizio appalto *"
               :rules="[ (val) => isValid('startDate', val, $v) ]"
               outlined v-model="startDate" mask="##/##/####">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="startDateProxy" transition-show="scale" transition-hide="scale">
              <q-date :readonly="selectedRdo" @input="resetEndDate" :disable="expirationDate == null" :locale="currentLocale" v-model="startDate" :options="calendarDataInizio"  mask="DD/MM/YYYY">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Annulla" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input @click="$refs.endDateProxy.show()" onkeydown="return false"
               :disable="selectedRdo != null || expirationDate == null || startDate == null"
               class="col-12 col-md-3" label=" Data presunta fine appalto *"
               :rules="[ (val) => isValid('endDate', val, $v) ]" outlined v-model="endDate" mask="##/##/####">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="endDateProxy" transition-show="scale" transition-hide="scale">
              <q-date :locale="currentLocale" v-model="endDate" :options="calendarDataFine"  mask="DD/MM/YYYY">
                <div :disable="expirationDate == null || startDate == null" class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Annulla" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- Riga -->

      <q-select class="col-12 col-md-3"
                outlined
                :options-dense="true"
                v-if="!selectedRdo"
                v-model="country"
                :disable="true"
                label="Nazione *"
                :options="countries" option-label="description"
                reactive-rules
                name="country"
                emit-value
                map-options
                :rules="[ (val) => isValid('country', val, $v) ]"
                transition-show="scale"
                transition-hide="scale"/>

      <q-select class="col-12 col-md-3"
                :disable="(!(country && regions.length>0))" :readonly="!(country && regions.length>0 && !selectedRdo)"
                :options="regions" option-label="description"  :options-dense="true"
                outlined
                v-model="rdo.regionOfInterest"
                label="Regione *"
                name="region"
                emit-value
                reactive-rules
                :rules="[ (val) => isValid('regionOfInterest', val, $v.rdo) ]"
                map-options
                transition-show="scale"
                transition-hide="scale"/>

      <q-select v-model="rdo.import"
                :options="imports"
                :disable="selectedRdo != null"
                name="import"
                outlined
                class="col-12 col-md-3"
                option-dense
                label="Importi *"
                use-chips
                transition-show="scale"
                transition-hide="scale"
                reactive-rules
                :rules="[ (val) => isValid('import', val, $v.rdo) ]"/>

      <div v-if="selectedRdo" class="desktop-only col-md-3"></div>
      <!-- Riga -->

      <q-select @input="getCatRdoOption"
                class="col-12 col-md-3"
                use-chips
                outlined option-dense
                :disable="selectedRdo != null"
                v-model="rdosMacrocategories"
                :options="macroRdo" option-label="description"
                label="Macrocategoria RDO"
                name="macrocategory"
                transition-show="scale"
                transition-hide="scale"
                emit-value
                map-options
                reactive-rules
                :rules="[ (val) => isValid('rdosMacrocategories', val, $v) ]"/>

      <q-select @input="getSubcatRdoOption"
                class="col-12 col-md-3"
                :disable="rdosMacrocategories == null || selectedRdo != null"
                :readonly="rdosMacrocategories == null || selectedRdo != null"
                outlined
                :options="firstCatRdo" option-label="description"
                :options-dense="true"
                v-model="rdosCategories"
                label="Categoria RDO"
                use-chips
                name="category"
                emit-value
                map-options
                transition-show="scale"
                transition-hide="scale"
                reactive-rules
                :rules="[ (val) => isValid('rdosCategories', val, $v) ]"/>

      <q-select class="col-12 col-md-3"
                :disable="rdosCategories == null || selectedRdo != null"
                :readonly="rdosCategories == null || selectedRdo != null"
                outlined
                :options="firstSubRdo" option-label="description"
                :options-dense="true"
                v-model="rdosSubcategories"
                label="Sottocategoria RDO"
                use-chips
                name="subcategory"
                emit-value
                map-options
                transition-show="scale"
                transition-hide="scale"
                reactive-rules
                :rules="[ (val) => isValid('rdosSubcategories', val, $v) ]"/>

      <!-- Riga -->

      <div class="col-12 col-md-3">
        <q-file
          v-if="!selectedRdo"
          v-model="cmeFile"
          label="Carica quì le informazioni economiche *"
          accept=".pdf"
          outlined
          use-chips
          :rules="[ (val) => isValid('cmeFile', val, $v) ]"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>

          <template v-slot:append>
            <q-icon class="desktop-only text-secondary" name="info">
              <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
                Inserire riepiloghi prezzi o computi già scontati del ribasso praticato al Committente, e sui quali sarà formulato il ribasso da parte dei soggetti interessati. <br>
                Qualora i prezzi facciano riferimento a più tipologie di lavori, forniture e servizi, si riceverà un ribasso medio.
                <br>Selezionare contemporaneamente uno o più file.
              </q-tooltip>
            </q-icon>
          </template>
        </q-file>

      </div>

      <div class="col-12 col-md-3">
        <q-file
          v-if="!selectedRdo"
          v-model="images"
          label="Carica quì eventuali immagini"
          accept=".png, .jpeg, .jpg"
          multiple
          outlined
          use-chips
          :rules="[ (val) => { return true }]"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:append>
            <q-icon class="desktop-only text-secondary" name="info">
              <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
                Inserisci foto dello stato dei luoghi.<br>Selezionare contemporaneamente uno o più file.
              </q-tooltip>
            </q-icon>
          </template>
        </q-file>
      </div>

      <div class="col-12 col-md-3">
        <q-file
          v-if="!selectedRdo"
          v-model="technicalFiles"
          label="Carica quì eventuali file tecnici"
          accept=".pdf"
          multiple
          outlined
          use-chips
          :rules="[ (val) => { return true }]"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:append>
            <q-icon class="desktop-only text-secondary" name="info">
              <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
               Potrai inserire altri file tecnici, utili alla formulazione dell'offerta (es. progetti, relazioni, etc...)<br>Selezionare contemporaneamente uno o più file.
              </q-tooltip>
            </q-icon>
          </template>
        </q-file>

      </div>

      <!-- Riga -->

      <q-input outlined
               v-model="rdo.reference"
               label="Contatto referente *"
               class="col-12 col-md-3"
               reactive-rules name="reference"
               :disable="selectedRdo != null"
               :rules="[ (val) => isValid('reference', val, $v.rdo) ]">
        <template v-slot:append>
          <q-icon class="desktop-only text-secondary" name="info">
            <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
              Contatto del responsabile al quale poter eventualmente richiedere maggiori informazioni. Può essere un recapito telefonico o un indirizzo email.
            </q-tooltip>
          </q-icon>
        </template>
      </q-input>

      <div class="col-12 col-md-3 flex column justify-center" style="height: 56px">
        <div>
          <span>Disponibilità sopralluoghi</span>
          <q-toggle
            v-model="rdo.needInspection"
            checked-icon="check"
            color="accent"
            unchecked-icon="clear"
            :disable="selectedRdo != null" />
        </div>
      </div>

      <div class="desktop-only col-md-3"></div>

      <div v-if="selectedRdo != null" class="col-12 col-md-3">
        <q-table
          title="Lista file"
          :data="data"
          :columns="columns"
          row-key="name"
          bordered
          separator="cell"
          :pagination="pagination"
          :hide-bottom="true"
        >
          <template>
            <div class="col-2 q-table__title">Lista file</div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td  key="description" :props="props">
                <div>
                  {{ props.row.file.Key.split('.')[1] }} <span v-if="props.row.file.index != null"> n. {{ props.row.file.index+1 }}</span>
                </div>
              </q-td>
              <q-td key="download" :props="props" >
                <q-icon v-if="props.row.file.Key" class="text-accent cursor-pointer" name="file_download" style="font-size: 2rem" @click="downloadFile(props.row.file.Key)"></q-icon>  </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div v-if="(selectedRdo != null && rdo.user._id != userLogged._id && !userLogged.admin)"
           class="col-12 col-md-3">
        <div>Seleziona i documenti con i quali corredare la tua offerta:</div>
        <q-option-group
          :options="getPresentationFiles"
          label="Notifications"
          type="checkbox"
          v-model="fileToShare"
        />

      </div>

      <div v-if="(selectedRdo != null && rdo.user._id != userLogged._id && !userLogged.admin)"
           class="col-12 col-md-3">
        <q-input outlined
                 class="input-ribasso col-12 col-md-3"
                 v-model="ribasso"
                 label-color="primary"
                 mask="###"
                 label="Ribasso in percentuale %"
                 :rules="[ (val) => isValid('ribasso', val, $v) ]">
          <template v-slot:append>
            <q-icon class="desktop-only text-secondary" name="info">
              <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
                Il ribasso inserito sarà inteso come scontistica da applicare ai prezzi aggiudicati e pubblicati dall'appaltatore. <br>Qualora i prezzi facciano riferimento a più tipologie di lavori, forniture e servizi, è opportuno offrire un ribasso medio
              </q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-12 row justify-center q-pt-xl q-pb-xl no-margin">
        <q-btn  v-if="(selectedRdo == null && rdo.user._id != userLogged._id)"
                push
                :ripple="false"
                class="col-3"
                label="Conferma"
                color="secondary"
                type='submit'/>

        <q-btn  v-if="(selectedRdo != null && rdo.user._id != userLogged._id && !userLogged.admin)"
                push
                :ripple="false"
                class="col-3"
                label="Invia Ribasso"
                color="secondary"
                @click="inviaRibasso"
        />
      </div>

    </div>

  </q-form>
</template>

<script>
import Rdo from 'src/model/rdo'
import validator from 'src/validations/validator'
import { imports, presentationFiles } from 'src/costants/options'
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'LoadRdo',
  props: ['selectedRdo'],
  data () {
    return {
      rdo: new Rdo(),
      rdosCategories: null,
      rdosMacrocategories: null,
      rdosSubcategories: null,
      isValid: validator.isValid,
      imports: imports,
      country: undefined,
      images: [],
      technicalFiles: [],
      cmeFile: undefined,
      expirationDate: undefined,
      startDate: undefined,
      endDate: undefined,
      currentLocale: {
        days: 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Sabato'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
        months: 'Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre'.split('_'),
        monthsShort: 'Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      },
      ribasso: null,
      pagination: {
        rowsPerPage: 0
      },
      columns: [
        { name: 'description', label: 'File', align: 'center' },
        { name: 'download', label: 'Download', align: 'center' }
      ],
      data: [],
      isTelephoneNumber: validator.isTelephoneNumber,
      presentationFiles: presentationFiles,
      fileToShare: []
    }
  },
  methods: {
    ...mapActions([
      'getMacroRdo',
      'getCatRdo',
      'getSubRdo',
      'getRegions',
      'getCountries',
      'updateRdo',
      'fetchUser',
      'createRdo',
      'uploadFile',
      'sendMail',
      'fetchFile'
    ]),
    getData () {
      if (this.data.length > 0) this.data = []
      this.rdo.images.forEach((img, index) => {
        img.index = index
        const obj = {
          file: img
        }
        this.data.push(obj)
      })
      this.rdo.technicalFiles.forEach((file, index) => {
        file.index = index
        const obj = {
          file: file
        }
        this.data.push(obj)
      })
      if (this.rdo.cmeFile) {
        const obj = {
          file: this.rdo.cmeFile
        }
        this.data.push(obj)
      }
    },
    async getRegionOptions () {
      await this.getRegions(this.country._id)
    },
    async getCatRdoOption () {
      this.rdosCategories = null
      this.rdosSubcategories = null

      const obj = {
        queryparams: { rdomacroId: this.rdosMacrocategories._id },
        order: 'first'
      }
      await this.getCatRdo(obj)
    },
    async getSubcatRdoOption () {
      this.rdosSubcategories = null
      const obj = {
        queryparams: { rdocatId: this.rdosCategories._id },
        order: 'first'
      }
      await this.getSubRdo(obj)
    },
    async loadRdo () {
      if (!this.$v.$invalid) {
        this.$q.loading.show()
        this.rdo.user = this.userLogged
        this.rdo.rdos = this.rdosSubcategories
        this.rdo.expirationDate = date.addToDate(date.extractDate(this.expirationDate, 'DD/MM/YYYY'), { hours: 2 })
        this.rdo.startDate = date.addToDate(date.extractDate(this.startDate, 'DD/MM/YYYY'), { hours: 2 })
        this.rdo.endDate = date.addToDate(date.extractDate(this.endDate, 'DD/MM/YYYY'), { hours: 2 })
        const obj = {
          pathParam: this.userLogged._id,
          body: this.rdo
        }
        const data = await this.createRdo(obj)
        await this.postFilesAndUpdateRdo(data.rdo)
        await this.fetchUser(obj)
        this.$emit('loadRdoSuccess', false)
        this.$q.notify({
          type: 'positive',
          message: 'Rdo caricata con successo!'
        })
        this.$q.loading.hide()
      }
    },
    async postFilesAndUpdateRdo (rdo) {
      const formData = new FormData()
      const cmeSlipt = this.cmeFile.name.split('.')
      const cmeFileType = cmeSlipt[cmeSlipt.length - 1]
      formData.append('file', this.cmeFile, `cmeFile.${cmeFileType}`)
      this.images.forEach((image) => {
        const imageSlipt = image.name.split('.')
        const imageType = imageSlipt[imageSlipt.length - 1]
        formData.append('file', image, `images.${imageType}`)
      })
      this.technicalFiles.forEach((techFile) => {
        const techFileSlipt = techFile.name.split('.')
        const techFileType = techFileSlipt[techFileSlipt.length - 1]
        formData.append('file', techFile, `technicalFiles.${techFileType}`)
      })
      const uploadedFiles = await this.uploadFile(formData)
      uploadedFiles.files.forEach((file) => {
        if (file.originalname === 'images' || file.originalname === 'technicalFiles') {
          rdo[file.Key.split('.')[1]].push(file)
        } else {
          rdo[file.Key.split('.')[1]] = file
        }
      })
      const obj = {
        pathParam: rdo._id + '/' + this.userLogged._id,
        body: rdo
      }
      await this.updateRdo(obj)
    },
    calendarDataScadenza (date) {
      const currentTime = new Date()
      const expirationTime = new Date()
      this.addMonths(expirationTime, 1)
      return (date >= currentTime.toLocaleDateString('fr-CA').replaceAll('-', '/') && date <= expirationTime.toLocaleDateString('fr-CA').replaceAll('-', '/'))
    },
    calendarDataInizio (date) {
      let dataScadenza
      if (this.expirationDate == null) {
        dataScadenza = new Date()
      } else {
        const dd = this.expirationDate.substr(0, 2)
        const mm = this.expirationDate.substr(3, 2)
        const yyyy = this.expirationDate.substr(6, 4)
        dataScadenza = new Date(mm + '/' + dd + '/' + yyyy)
      }
      return date >= dataScadenza.toLocaleDateString('fr-CA').replaceAll('-', '/')
    },
    calendarDataFine (date) {
      let dataInizio
      if (this.startDate == null) {
        dataInizio = new Date()
      } else {
        const dd = this.startDate.substr(0, 2)
        const mm = this.startDate.substr(3, 2)
        const yyyy = this.startDate.substr(6, 4)
        dataInizio = new Date(mm + '/' + dd + '/' + yyyy)
      }
      return date >= dataInizio.toLocaleDateString('fr-CA').replaceAll('-', '/')
    },
    resetStartEndDate () {
      this.startDate = undefined
      this.endDate = undefined
    },
    resetEndDate () {
      this.endDate = undefined
    },
    addMonths (date, months) {
      var d = date.getDate()
      date.setMonth(date.getMonth() + +months)
      if (date.getDate() !== d) {
        date.setDate(0)
      }
      return date
    },
    async inviaRibasso () {
      if (!this.$v.$invalid) {
        this.$q.loading.show()
        let certificateUrl = ''
        let durcUrl = ''
        let whiteListUrl = ''
        let isoFileUrl = ''
        let fgasUrl = ''
        let presentationUrl = ''
        let soaUrl = ''
        if (this.fileToShare.includes('certificate')) { certificateUrl = await this.fetchFile({ pathParam: this.userLogged.certificateFile.key }) }
        if (this.fileToShare.includes('durc')) { durcUrl = await this.fetchFile({ pathParam: this.userLogged.durcRegolarityFile.key }) }
        if (this.fileToShare.includes('whiteList')) { whiteListUrl = await this.fetchFile({ pathParam: this.userLogged.antimafiaFile.key }) }
        if (this.fileToShare.includes('iso')) { isoFileUrl = await this.fetchFile({ pathParam: this.userLogged.isoFile.key }) }
        if (this.fileToShare.includes('fgas')) { fgasUrl = await this.fetchFile({ pathParam: this.userLogged.fgasFile.key }) }
        if (this.fileToShare.includes('presentation')) { presentationUrl = await this.fetchFile({ pathParam: this.userLogged.lendingFile.key }) }
        if (this.fileToShare.includes('soa')) { soaUrl = await this.fetchFile({ pathParam: this.userLogged.soaFile.key }) }
        const infoRibassoEmail = {
          to: this.rdo.user.username,
          from: 'dario.cascone93@gmail.com',
          subject: 'Ricezione offerta per RDO: ' + this.rdo.description,
          html: 'Spett.le ' + this.rdo.contractor + ', <br/>' +
            'l\'operatore economico <strong>' + this.userLogged.companyName + '</strong> ha inviato la seguente offerta: <br/>' +
            'Ribasso: <strong>' + this.ribasso + '%</strong><br/>' +
            'Note: ' + this.rdo.peculiarity + '<br/>' + this.rdo.requiredDocuments + '<br/><br/>' +
            (this.fileToShare.length > 0 ? 'Di seguito trova i link ai file relativi all\'azienda: <br/>' : '') +
            (this.fileToShare.includes('certificate') === true ? '<a href="' + certificateUrl.url + '">Certificato o Visura Camerale</a><br/>' : '') +
            (this.fileToShare.includes('durc') === true ? '<a href="' + durcUrl.url + '">Regolarità Durc</a><br/>' : '') +
            (this.fileToShare.includes('whiteList') === true ? '<a href="' + whiteListUrl.url + '">Iscrizione White List o Dichiarazione sostitutiva antimafia</a><br/>' : '') +
            (this.fileToShare.includes('iso') === true ? '<a href="' + isoFileUrl.url + '">ISO</a><br/>' : '') +
            (this.fileToShare.includes('fgas') === true ? '<a href="' + fgasUrl.url + '">Patentino F-Gas</a><br/>' : '') +
            (this.fileToShare.includes('presentation') === true ? '<a href="' + presentationUrl.url + '">Presentazione</a><br/>' : '') +
            (this.fileToShare.includes('soa') === true ? '<a href="' + soaUrl.url + '">SOA</a><br/>' : '') +
            '<br/>Distinti Saluti,<br/>' +
            '<span style="color:#29ABF4">Subapp.it s.r.l.s</span>'
        }

        await this.sendMail(infoRibassoEmail)
        this.$q.loading.hide()
      }
    },
    async loadSelectedRdo () {
      this.rdo = JSON.parse(JSON.stringify(this.selectedRdo)) // to avoid reference
      this.expirationDate = new Date(this.rdo.expirationDate).toLocaleDateString('fr')
      this.startDate = new Date(this.rdo.startDate).toLocaleDateString('fr')
      this.endDate = new Date(this.rdo.endDate).toLocaleDateString('fr')

      let macroOpt = null
      macroOpt = this.loadSelectedRdoOptions('macroRdo', macroOpt)
      this.rdosMacrocategories = macroOpt
      await this.getCatRdoOption()

      let catOpt = null
      catOpt = this.loadSelectedRdoOptions('firstCatRdo', catOpt)
      this.rdosCategories = catOpt
      await this.getSubcatRdoOption()

      let subOpt = null
      subOpt = this.loadSelectedRdoOptions('firstSubRdo', subOpt)
      this.rdosSubcategories = subOpt
    },
    loadSelectedRdoOptions (key, option) {
      this[key].forEach((item) => {
        if (key === 'macroRdo') {
          if (item._id === this.rdo.rdos.macrocategory) {
            option = item
          }
        }
        if (key === 'firstCatRdo') {
          if (item._id === this.rdo.rdos.category) {
            option = item
          }
        }
        if (key === 'firstSubRdo') {
          if (item._id === this.rdo.rdos._id) {
            option = item
          }
        }
      })

      return option
    },
    async downloadFile (key) {
      const obj = {
        pathParam: key
      }
      const data = await this.fetchFile(obj)
      window.open(data.url)
    }
  },
  computed: {
    ...mapGetters({
      macroRdo: 'macroRdo',
      userLogged: 'user',
      firstCatRdo: 'firstCatRdo',
      regions: 'regions',
      firstSubRdo: 'firstSubRdo',
      countries: 'countries'
    }),
    getPresentationFiles () {
      const presentationFiles = []
      if (this.userLogged.certificateFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'certificate' }))
      }
      if (this.userLogged.durcRegolarityFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'durc' }))
      }
      if (this.userLogged.antimafiaFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'whiteList' }))
      }
      if (this.userLogged.isoFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'iso' }))
      }
      if (this.userLogged.fgasFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'fgas' }))
      }
      if (this.userLogged.lendingFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'presentation' }))
      }
      if (this.userLogged.soaFile != null) {
        presentationFiles.push(this.presentationFiles.find((item) => { return item.value === 'soa' }))
      }
      return presentationFiles
    }
  },
  async created () {
    if (this.selectedRdo) {
      await this.getMacroRdo()
      await this.loadSelectedRdo()
      this.getData()
    } else {
      await this.getCountries()
      if (!this.selectedRdo) {
        this.country = this.countries.find((country) => {
          return country.description === 'Italia'
        })
      }
      await this.getRegionOptions()
      await this.getMacroRdo()
    }
  },
  async mounted () {
    if (!this.selectedRdo) {
      this.rdo.contractor = this.userLogged.companyName
    }
    this.$v.$touch()
  },
  validations () {
    return {
      rdo: {
        import: {
          required
        },
        regionOfInterest: {
          required
        },
        contractor: {
          required
        },
        needInspection: {
          required
        },
        reference: {
          required,
          isTelephoneOrEmail: validator.isTelephoneOrEmail
        },
        description: {
          required
        }
      },
      rdosSubcategories: {
        required
      },
      rdosMacrocategories: {
        required
      },
      rdosCategories: {
        required
      },
      startDate: {
        required
      },
      endDate: {
        required
      },
      expirationDate: {
        required
      },
      cmeFile: {
        required: !this.selectedRdo ? required : false
      },
      ribasso: {
        required: this.selectedRdo ? required : false,
        isRibasso: this.selectedRdo ? validator.isRibasso : false
      },
      country: {
        required: !this.selectedRdo ? required : false
      }
    }
  }
}
</script>

<style scoped>

</style>

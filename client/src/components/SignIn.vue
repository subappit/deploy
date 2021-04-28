<template>
  <q-form @submit="onSignup">
    <q-stepper
      v-model="step"
      ref="stepper"
      alternative-labels
      done-color="positive"
      error-color="negative"
      active-color="accent"
      transition-prev="fade"
      transition-next="fade"
      animated
      flat
      keep-alive
    >
      <q-step
        class="scroll"
        :name="1"
        title="Informazioni generali"
        icon="settings"
        :done="step > 1">
        <div class="row wrap justify-center content-center no-padding no-margin q-gutter-x-md q-gutter-y-lg">
          <q-input   outlined
                     v-model="user.username"
                     type="text"
                     :disable="isEditing"
                     label="Username *"
                     class="col-12 col-md-3"
                     reactive-rules name="username"
                     :rules="[ (val) => isValid('username', val, $v.user) ]" >
            <template v-slot:append>
              <q-icon class="desktop-only text-secondary" name="info">
                <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
                  {{$t('signin.tooltip.username')}}
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>

            <q-input outlined
                     v-if="!isEditing"
                     v-model="user.password"
                     label="Password *"
                     :type="isPsw ? 'password' : 'text'"
                     class="col-12 col-md-3"
                     reactive-rules name="password"
                     :rules="[ (val) => isValid('password', val, $v.user) ]" >
              <template v-slot:append>
                <q-icon
                  :name="isPsw ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPsw = !isPsw"
                />
              </template>
            </q-input>

          <q-input outlined
                   v-model="user.pec"
                   type="text"
                   label="email PEC *"
                   class="col-12 col-md-3"
                   reactive-rules name="pec"
                   :rules="[ (val) => isValid('pec', val, $v.user) ]" />

          <q-input v-model="user.companyName"
                   outlined
                   type="text"
                   :disable="isEditing && !isAdmin"
                   class="col-12 col-md-3"
                   name="companyName"
                   label="Ragione sociale *"
                   reactive-rules
                   :rules="[ (val) => isValid('companyName', val, $v.user) ]" >
            <template v-slot:append>
              <q-icon class="desktop-only text-secondary" name="info">
                <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
                  {{$t('signin.tooltip.companyName')}}
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>

          <q-select class="col-12 col-md-3"
                    outlined
                    :disable="true"
                    :options-dense="true"
                    v-model="user.country"
                    label="Nazione sede*"
                    :options="countries" option-label="description"
                    reactive-rules
                    name="country"
                    emit-value
                    map-options
                    :rules="[ (val) => isValid('country', val, $v.user) ]"
                    transition-show="scale"
                    transition-hide="scale"
          />
          <q-select @input="getProvinceOptions"
                    class="col-12 col-md-3"
                    :disable="(!(user.country && regions.length>0)) || (isEditing && !isAdmin)" :readonly="!(user.country && regions.length>0)"
                    :options="regions" option-label="description"  :options-dense="true"
                    outlined
                    v-model="user.region"
                    label="Regione sede*"
                    name="region"
                    emit-value
                    reactive-rules
                    :rules="[ (val) => isValid('region', val, $v.user) ]"
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
          />

          <q-select @input="getCityOptions"
                    class="col-12 col-md-3"
                    :disable="(!(user.region && provinces.length>0)) || (isEditing && !isAdmin)" :readonly="!(user.region && provinces.length>0)"
                    option-label="description" option-dense v-model="user.province" :options="provinces"
                    label="Provincia sede*"
                    reactive-rules name="region"
                    :rules="[ (val) => isValid('province', val, $v.user) ]"
                    emit-value
                    map-options
                    outlined
                    transition-show="scale"
                    transition-hide="scale"
          />

          <q-select :disable="(!(user.province && cities.length>0)) || (isEditing && !isAdmin)" :readonly="!(user.province && cities.length>0)"
                    class="col-12 col-md-3"
                    option-label="description" option-dense :options="cities"
                    name="city"
                    outlined
                    map-options
                    emit-value
                    label="Città sede*"
                    v-model="user.city"
                    reactive-rules
                    :rules="[ (val) => isValid('city', val, $v.user) ]"
                    transition-show="scale"
                    transition-hide="scale"
          />

          <q-input outlined
                   :disable="isEditing && !isAdmin"
                   v-model="user.postalCode"
                   type="number" label="CAP sede*"
                   class="col-12 col-md-3"
                   name="postalCode"
                   reactive-rules
                   :rules="[ (val) => isValid('postalCode', val, $v.user) ]" />

          <q-input outlined
                   v-model="user.registeredOfficeAddress"
                   type="text"
                   :disable="isEditing && !isAdmin"
                   label="Indirizzo sede legale *"
                   reactive-rules name="registeredOfficeAddress"
                   class="col-12 col-md-3"
                   :rules="[ (val) => isValid('registeredOfficeAddress', val, $v.user) ]" />

          <q-input outlined
                   v-model="user.vatNumber"
                   :disable="isEditing && !isAdmin"
                   class="col-12 col-md-3"
                   type="text"
                   label="Partita IVA *"
                   reactive-rules name="vatNumber"
                   :rules="[ (val) => isValid('vatNumber', val, $v.user) ]" />

          <q-input outlined
                   v-model="user.fiscalCode"
                   type="text"
                   :disable="isEditing && !isAdmin"
                   class="col-12 col-md-3"
                   label="Codice Fiscale *"
                   reactive-rules name="fiscalCode"
                   :rules="[ (val) => isValid('fiscalCode', val, $v.user) ]" />

          <q-input outlined v-model="user.webSite" type="text" label="Sito Web"
                   class="col-12 col-md-3"
                   reactive-rules name="webSite"
                   :rules="[ (val) => isValid('webSite', val, $v.user) ]" />

          <q-input outlined
                   v-model="user.telephoneNumber"
                   type="number"
                   label="Telefono *"
                   class="col-12 col-md-3"
                   reactive-rules name="telephoneNumber"
                   :rules="[ (val) => isValid('telephoneNumber', val, $v.user) ]" />

          <q-input outlined
                   v-model="user.SDICode"
                   class="col-12 col-md-3"
                   type="text"
                   label="Codice SDI *"
                   reactive-rules
                   name="SDICode"
                   :rules="[ (val) => isValid('SDICode', val, $v.user) ]" >
            <template v-slot:append>
              <q-icon name="info" class="desktop-only text-secondary">
                <q-tooltip anchor="top middle" self="bottom middle" content-class="bg-accent" content-style="font-size: 13px" :offset="[10, 10]">
                  {{$t('signin.tooltip.SDICode')}}
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
          <div class="desktop-only col-md-3"></div>
          <div class="desktop-only col-md-3"></div>
        </div>
      </q-step>

      <q-step
        class="scroll full-height"
        :name="2"
        title="Dati Azienda"
        icon="create_new_folder"
        :done="step > 2"
      >

        <div class="row wrap justify-center content-center no-padding no-margin q-gutter-x-md q-gutter-y-xs">

          <!--riga-->
          <div class="col-12 col-md-3 order-1">
            <span>SOA</span>
            <q-toggle
              v-model="soaToggle"
              checked-icon="check"
              color="accent"
              unchecked-icon="clear"
            />
          </div>
          <div class="col-12 col-md-3 order-3">

            <span>ISO</span>
            <q-toggle
              v-model="isoToggle"
              checked-icon="check"
              color="accent"
              unchecked-icon="clear"
            />

          </div>
          <div class="col-12 col-md-3 order-5">

            <span>Patentino Fgas</span>
            <q-toggle
              v-model="fgasToggle"
              checked-icon="check"
              color="accent"
              unchecked-icon="clear"
            />

          </div>
          <!--riga-->
          <div class="col-12 col-md-3 order-2">
            <q-file
              :disable="!soaToggle"
              v-model="soaFile"
              label="Carica quì il documento richiesto"
              accept=".pdf"
              outlined
              use-chips
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="col-12 col-md-3 order-4">
            <q-file
              :disable="!isoToggle"
              v-model="isoFile"
              label="Carica quì il documento richiesto"
              accept=".pdf"
              outlined
              use-chips
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="col-12 col-md-3 order-6">
            <q-file
              :disable="!fgasToggle"
              v-model="fgasFile"
              label="Carica quì il documento richiesto"
              outlined
              accept=".pdf"
              use-chips
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <!--riga-->
          <div class="col-12 col-md-3 q-pt-md order-7">
            Richieste di offerta *
          </div>
          <div class="desktop-only col-12 col-md-3"></div>
          <div class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <q-select @input="getFirstCatRdoOption"
                    class="col-12 col-md-3 order-8"
                    use-chips
                    outlined option-dense
                    v-model="firstRdosMacrocategory"
                    :options="macroRdo" option-label="description"
                    label="Macrocategoria"
                    name="macrocategory"
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                    reactive-rules
                    :rules="[ (val) => isValid('firstRdosMacrocategory', val, $v) ]"
          />

          <q-select @input="getFirstSubcatRdoOption"
                    class="col-12 col-md-3 order-9"
                    :disable="!firstRdosMacrocategory"
                    :readonly="!firstRdosMacrocategory"
                    outlined
                    :options="firstCatRdo" option-label="description"
                    :options-dense="true"
                    v-model="firstRdosCategories"
                    label="Categoria"
                    multiple use-chips
                    name="category"
                    emit-value
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('firstRdosCategories', val, $v) ]"
          />

          <q-select class="col-12 col-md-3 order-10"
                    :disable="!firstRdosCategories.length>0"
                    :readonly="!firstRdosCategories.length>0"
                    outlined
                    :options="firstSubRdo" option-label="description"
                    :options-dense="true"
                    v-model="firstRdosSubcategories"
                    label="Sottocategoria"
                    multiple use-chips
                    name="subcategory"
                    emit-value
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('firstRdosSubcategories', val, $v) ]"
          />
          <!--riga-->
          <div class="col-12 col-md-3 q-pt-md order-11">
            Importi *
          </div>
          <div class="col-12 col-md-3 q-pt-md order-13">
            Regioni di interesse *
          </div>
          <div class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <q-select v-model="firstImports"
                    :options="imports"
                    name="imports"
                    outlined
                    class="col-12 col-md-3 order-12"
                    option-dense
                    multiple
                    label="Importi *"
                    use-chips
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('firstImports', val, $v) ]"
          />

          <q-select  class="col-12 col-md-3 order-14"
                     :disable="!regions.length>0" :readonly="!regions.length>0"
                     outlined
                     :options-dense="true" :options="regions" option-label="description"
                     v-model="firstRegionsOfInterest"
                     label="Regioni di interesse *"
                     multiple
                     use-chips
                     emit-value
                     map-options
                     transition-show="scale"
                     transition-hide="scale"
                     reactive-rules
                     :rules="[ (val) => isValid('firstRegionsOfInterest', val, $v) ]"
          />
          <div class="desktop-only col-12 col-md-3">
            <q-btn v-if="!needSecondRdo && !isEditing" flat color="secondary" icon-right="add" label="Aggiungi RDO" @click="needSecondRdo = true"/>
          </div>
          <div v-if="needSecondRdo" class="col-12 col-md-3 q-pt-md order-7">
            Richieste di offerta *
          </div>
          <div v-if="needSecondRdo" class="desktop-only col-12 col-md-3"></div>
          <div v-if="needSecondRdo" class="desktop-only col-12 col-md-3"></div>
          <q-select v-if="needSecondRdo"
                    @input="getSecondCatRdoOption"
                    class="col-12 col-md-3 order-8"
                    use-chips
                    outlined option-dense
                    v-model="secondRdosMacrocategory"
                    :options="macroRdo" option-label="description"
                    label="Macrocategoria"
                    name="macrocategory"
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                    reactive-rules
                    :rules="[ (val) => isValid('secondRdosMacrocategory', val, $v) ]"
          />

          <q-select v-if="needSecondRdo"
                    @input="getSecondSubcatRdoOption"
                    class="col-12 col-md-3 order-9"
                    :disable="!secondRdosMacrocategory"
                    :readonly="!secondRdosMacrocategory"
                    outlined
                    :options="secondCatRdo" option-label="description"
                    :options-dense="true"
                    v-model="secondRdosCategories"
                    label="Categoria"
                    multiple use-chips
                    name="category"
                    emit-value
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('secondRdosCategories', val, $v) ]"
          />

          <q-select v-if="needSecondRdo"
                    class="col-12 col-md-3 order-10"
                    :disable="!secondRdosCategories.length>0"
                    :readonly="!secondRdosCategories.length>0"
                    outlined
                    :options="secondSubRdo" option-label="description"
                    :options-dense="true"
                    v-model="secondRdosSubcategories"
                    label="Sottocategoria"
                    multiple use-chips
                    name="subcategory"
                    emit-value
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('secondRdosSubcategories', val, $v) ]"
          />
          <!--riga-->
          <div v-if="needSecondRdo" class="col-12 col-md-3 q-pt-md order-11">
            Importi *
          </div>
          <div v-if="needSecondRdo" class="col-12 col-md-3 q-pt-md order-13">
            Regioni di interesse *
          </div>
          <div v-if="needSecondRdo" class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <q-select v-if="needSecondRdo"
                    v-model="secondImports"
                    :options="imports"
                    name="imports"
                    outlined
                    class="col-12 col-md-3 order-12"
                    option-dense
                    multiple
                    label="Importi *"
                    use-chips
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('secondImports', val, $v) ]"
          />

          <q-select  v-if="needSecondRdo"
                     class="col-12 col-md-3 order-14"
                     :disable="!regions.length>0" :readonly="!regions.length>0"
                     outlined
                     :options-dense="true" :options="regions" option-label="description"
                     v-model="secondRegionsOfInterest"
                     label="Regioni di interesse *"
                     multiple
                     use-chips
                     emit-value
                     map-options
                     transition-show="scale"
                     transition-hide="scale"
                     reactive-rules
                     :rules="[ (val) => isValid('secondRegionsOfInterest', val, $v) ]"
          />

          <div v-if="needSecondRdo" class="desktop-only col-12 col-md-3 flex">
            <q-btn v-if="!needThirdRdo  && !isEditing" flat color="secondary" icon-right="add" label="Aggiungi RDO" @click="needThirdRdo = true" />
            <q-btn v-if="needSecondRdo  && !isEditing" flat color="negative" icon-right="remove" label="Rimuovi RDO" @click="needSecondRdo = false"/>
          </div>
          <div v-if="needThirdRdo" class="col-12 col-md-3 q-pt-md order-7">
            Richieste di offerta *
          </div>
          <div v-if="needThirdRdo" class="desktop-only col-12 col-md-3"></div>
          <div v-if="needThirdRdo" class="desktop-only col-12 col-md-3"></div>
          <q-select v-if="needThirdRdo"
                    @input="getThirdCatRdoOption"
                    class="col-12 col-md-3 order-8"
                    use-chips
                    outlined option-dense
                    v-model="thirdRdosMacrocategory"
                    :options="macroRdo" option-label="description"
                    label="Macrocategoria"
                    name="macrocategory"
                    transition-show="scale"
                    transition-hide="scale"
                    emit-value
                    map-options
                    reactive-rules
                    :rules="[ (val) => isValid('thirdRdosMacrocategory', val, $v) ]"
          />

          <q-select v-if="needThirdRdo"
                    @input="getThirdSubcatRdoOption"
                    class="col-12 col-md-3 order-9"
                    :disable="!thirdRdosMacrocategory"
                    :readonly="!thirdRdosMacrocategory"
                    outlined
                    :options="thirdCatRdo" option-label="description"
                    :options-dense="true"
                    v-model="thirdRdosCategories"
                    label="Categoria"
                    multiple use-chips
                    name="category"
                    emit-value
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('thirdRdosCategories', val, $v) ]"
          />

          <q-select v-if="needThirdRdo"
                    class="col-12 col-md-3 order-10"
                    :disable="!thirdRdosCategories.length>0"
                    :readonly="!thirdRdosCategories.length>0"
                    outlined
                    :options="thirdSubRdo" option-label="description"
                    :options-dense="true"
                    v-model="thirdRdosSubcategories"
                    label="Sottocategoria"
                    multiple use-chips
                    name="subcategory"
                    emit-value
                    map-options
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('thirdRdosSubcategories', val, $v) ]"
          />
          <!--riga-->
          <div v-if="needThirdRdo"  class="col-12 col-md-3 q-pt-md order-11">
            Importi *
          </div>
          <div v-if="needThirdRdo"  class="col-12 col-md-3 q-pt-md order-13">
            Regioni di interesse *
          </div>
          <div v-if="needThirdRdo"  class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <q-select v-if="needThirdRdo"
                    v-model="thirdImports"
                    :options="imports"
                    name="imports"
                    outlined
                    class="col-12 col-md-3 order-12"
                    option-dense
                    multiple
                    label="Importi *"
                    use-chips
                    transition-show="scale"
                    transition-hide="scale"
                    reactive-rules
                    :rules="[ (val) => isValid('thirdImports', val, $v) ]"
          />

          <q-select  v-if="needThirdRdo"
                     class="col-12 col-md-3 order-14"
                     :disable="!regions.length>0" :readonly="!regions.length>0"
                     outlined
                     :options-dense="true" :options="regions" option-label="description"
                     v-model="thirdRegionsOfInterest"
                     label="Regioni di interesse *"
                     multiple
                     use-chips
                     emit-value
                     map-options
                     transition-show="scale"
                     transition-hide="scale"
                     reactive-rules
                     :rules="[ (val) => isValid('thirdRegionsOfInterest', val, $v) ]"
          />

          <div v-if="needThirdRdo" class="desktop-only col-12 col-md-3 flex">
            <q-btn v-if="needThirdRdo && !isEditing" flat color="negative" icon-right="remove" label="Rimuovi RDO" @click="needThirdRdo = false"/>
          </div>
          <!--riga-->
          <div class="col-12 col-md-3 q-pt-md order-15">
            Iscrizione White List o Dichiarazione Antimafia *
          </div>
          <div class="col-12 col-md-3 q-pt-md order-17">
            Presentazione Aziendale *
          </div>
          <div class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <div class="col-12 col-md-3 order-16">
            <q-file
              v-model="antimafiaFile"
              label="Carica quì il documento richiesto"
              accept=".pdf"
              outlined
              use-chips
              :rules="[ (val) => isValid('antimafiaFile', val, $v) ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="col-12 col-md-3 order-18">
            <q-file
              v-model="lendingFile"
              label="Carica quì il documento richiesto"
              outlined
              accept=".pdf"
              use-chips
              :rules="[ (val) => isValid('lendingFile', val, $v) ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <div class="col-12 col-md-3 q-pt-md order-19">
            Certificato o Visura Camerale *
          </div>
          <div class="desktop-only col-12 col-md-3"></div>
          <div class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <div class="col-12 col-md-3 order-20">
            <q-file
              v-model="certificateFile"
              label="Carica quì il documento richiesto"
              outlined
              accept=".pdf"
              use-chips
              :rules="[ (val) => isValid('certificateFile', val, $v) ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <q-input  @click="$refs.qDateCertificateProxy.show()"
                    onkeydown="return false"
                    class="col-12 col-md-2 order-21" label="Data Scadenza"
                    :rules="[ (val) => isValid('certificateDate', val, $v.user) ]"
                    outlined v-model="user.certificateDate" mask="##/##/####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateCertificateProxy" transition-show="scale" transition-hide="scale">
                  <q-date :locale="currentLocale" v-model="user.certificateDate" :options="calendarOptionCertificate"  mask="DD/MM/YYYY">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="Annulla" color="primary" flat v-close-popup />
                      <q-btn label="OK" color="primary" flat v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="desktop-only col-12 col-md-4"></div>
          <!--riga-->
          <div class="col-12 col-md-3 q-pt-md order-22">
            Regolarità Durc *
          </div>
          <div class="desktop-only col-12 col-md-3"></div>
          <div class="desktop-only col-12 col-md-3"></div>
          <!--riga-->
          <div class="col-12 col-md-3 order-23">
            <q-file
              v-model="durcRegolarityFile"
              label="Carica quì il documento richiesto"
              outlined
              accept=".pdf"
              use-chips
              :rules="[ (val) => isValid('durcRegolarityFile', val, $v) ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <q-input  @click="$refs.qDateDurcProxy.show()"
                    onkeydown="return false"
                    class="col-12 col-md-2 order-24" label="Data Scadenza"
                    :rules="[ (val) => isValid('durcRegolarityDate', val, $v.user) ]"
                    outlined v-model="user.durcRegolarityDate" mask="##/##/####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateDurcProxy" transition-show="scale" transition-hide="scale">
                  <q-date :locale="currentLocale" v-model="user.durcRegolarityDate" :options="calendarOptionDurc"  mask="DD/MM/YYYY">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="Annulla" color="primary" flat v-close-popup />
                      <q-btn label="OK" color="primary" flat v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="desktop-only col-12 col-md-4"></div>
          <div v-if="false" class=" col-12 col-md-9 q-pt-md row">
            <div class="col-12 company-category">
              <div>
                Ai sensi dell’art. 3 – aa, Decreto Legislativo n. 50/2016 e s.m.i., appartiene alla categoria:
              </div>
              <div class="q-pt-md q-pb-md">
                <q-option-group
                  v-model="user.companyCategory"
                  :options="compCatOptions"
                  color="primary"
                />
              </div>
            </div>
          </div>
        </div>

      </q-step>

      <q-step
        v-if="!isEditing"
        class="scroll"
        :name="3"
        title="Consensi"
        icon="add_comment"
      >
        <div class="row wrap justify-center content-center no-padding no-margin q-gutter-x-md q-gutter-y-xs">
          <div class="col-12 col-md-9 q-pt-md">
           * Tutti i campi sono obbligatori.
          </div>
          <div class="col-12 col-md-9 q-pt-md">
           Al termine, riceverai una mail con le istruzioni da seguire per effettuare il pagamento e completare il processo di registrazione.
          </div>
          <div class="col-12 col-md-9 q-pt-md">
            Leggi e accetta la <a class="hyperlink"  @click="goToPrivacy">Privacy</a> di Subapp per proseguire con la registrazione.
          </div>
          <div class="col-12 col-md-9 q-pt-md q-pb-md">
            <div class="q-gutter-sm">
              <q-radio dense v-model="regulation" val="true" label="Accetto" />
              <q-radio dense v-model="regulation" val="false" label="Non Accetto" />
            </div>
          </div>
          <div class="col-12 col-md-9 q-pt-md">
            Leggi e accetta i <a class="hyperlink" @click="goToTeC">Termini e Condizioni</a> di Subapp per proseguire con la registrazione.
          </div>
          <div class="col-12 col-md-9 q-pt-md q-pb-md">
            <div class="q-gutter-sm">
              <q-radio dense v-model="termAndCondition" val="true" label="Accetto" />
              <q-radio dense v-model="termAndCondition" val="false" label="Non Accetto" />
            </div>
          </div>
          <div v-if="false" class="col-12 col-md-9 q-pt-md">
            Ai sensi dell’art. 46 del D.P.R. 28 dicembre 2000 n. 445, la Ditta, consapevole delle sanzioni penali, previste dall’art. 76 del D.P.R. n. 445/2000, per le ipotesi di falsità in atti e dichiarazioni mendaci ivi indicate, dichiara:
            <ul>
              <li>di non trovarsi nelle condizioni previste dall’art. 80 del Decreto Legislativo 18 aprile 2016 n. 50 e s.m.i.</li>
              <li>di non essere oggetto di provvedimenti di sospensione o interdittivi di cui all’art. 14, comma 1, D.Lgs. 81/08</li>
              <li>di essere in regola con quanto previsto con il D.Lgs 81/08, in materia di sicurezza</li>
              <li>di conoscere i limiti previsti dalla disciplina del subappalto</li>
            </ul>
          </div>
          <div v-if="false" class="col-12 col-md-9 q-pb-md">
            <div class="q-gutter-sm">
              <q-radio dense v-model="compDeclaration" val="true" label="Si" />
              <q-radio dense v-model="compDeclaration" val="false" label="No" />
            </div>
          </div>
          <div v-if="false" class="col-12 col-md-9 q-pt-md row">
            <div class="col-12 company-category">
              <div>
              Ai sensi dell’art. 3 – aa, Decreto Legislativo n. 50/2016 e s.m.i., appartiene alla categoria:
              </div>
              <div class="q-pt-md q-pb-md">
                <q-option-group
                  v-model="user.companyCategory"
                  :options="compCatOptions"
                  color="primary"
                />
              </div>
            </div>
          </div>
        </div>

      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="flex justify-between">
          <div>
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Indietro" class="q-ml-sm" />
          </div>
          <div>
            <q-btn type="submit" :disable="(termAndCondition === 'false' || regulation === 'false') && step === 3"
                   color="primary" :label="getBtnLabel" />
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { imports, compCatOptions } from '../costants/options'
import { mapActions, mapGetters } from 'vuex'
import validator from '../validations/validator'
import User from '../model/user'
import { date } from 'quasar'

export default {
  name: 'SignIn',
  data () {
    return {
      user: new User(),
      // legalFormOptions: legalFormOptions,
      imports: imports,
      compCatOptions: compCatOptions,
      step: 1,
      alert: false,
      isPsw: true,
      isValid: validator.isValid,
      isFiscalCode: validator.isFiscalCode,
      isSDICode: validator.isSDICode,
      isVatNumber: validator.isVatNumber,
      isPostalCode: validator.isPostalCode,
      isWebSite: validator.isWebSite,
      isTelephoneNumber: validator.isTelephoneNumber,
      isPassword: validator.isPassword,
      currentLocale: {
        days: 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Sabato'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
        months: 'Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre'.split('_'),
        monthsShort: 'Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      },
      certificateFile: null,
      durcRegolarityFile: null,
      antimafiaFile: null,
      lendingFile: null,
      isoFile: null,
      soaFile: null,
      fgasFile: null,
      soaToggle: false,
      isoToggle: false,
      fgasToggle: false,
      firstRdosCategories: [],
      firstRdosMacrocategory: null,
      firstRdosSubcategories: [],
      firstImports: [],
      firstRegionsOfInterest: [],
      secondRdosCategories: [],
      secondRdosMacrocategory: null,
      secondRdosSubcategories: [],
      secondImports: [],
      secondRegionsOfInterest: [],
      thirdRdosCategories: [],
      thirdRdosMacrocategory: null,
      thirdRdosSubcategories: [],
      thirdImports: [],
      needSecondRdo: false,
      needThirdRdo: false,
      thirdRegionsOfInterest: [],
      regulation: 'false',
      termAndCondition: 'false',
      compDeclaration: ''

    }
  },
  props: ['showAlert', 'isEditing', 'isAdmin', 'selectedUser'],
  methods: {
    ...mapActions([
      'getCountries',
      'getRegions',
      'getProvinces',
      'getCities',
      'signup',
      'getMacroRdo',
      'getCatRdo',
      'getSubRdo',
      'uploadFile',
      'updateUser',
      'fetchUser',
      'updateLoggedUser',
      'deleteFiles'
    ]),
    viewRegulation () {
      window.open('', '_blank ')
    },
    async buildEditProfilePage () {
      if (!this.isAdmin) {
        this.user = JSON.parse(JSON.stringify(this.userLogged)) // to avoid reference
      } else {
        this.user = JSON.parse(JSON.stringify(this.selectedUser)) // to avoid reference
      }

      this.loadUserLoggedFile()

      this.user.certificateDate = new Date(this.user.certificateDate).toLocaleDateString('fr')
      this.user.durcRegolarityDate = new Date(this.user.durcRegolarityDate).toLocaleDateString('fr')

      await this.getRegions(this.user.country._id)
      await this.getProvinces(this.user.region._id)
      await this.getCities(this.user.province._id)

      let macroOpt = []
      macroOpt = this.loadEditProfileOptions('macroRdo', macroOpt)

      this.firstRdosMacrocategory = macroOpt.find((item) => { return item.position === 'first' }).macro
      await this.getFirstCatRdoOption()
      this.firstImports = this.user.rdos.first.imports
      this.firstRegionsOfInterest = this.user.rdos.first.regionsOfInterest

      if (this.user.rdos.second) {
        this.secondRdosMacrocategory = macroOpt.find((item) => { return item.position === 'second' }).macro
        await this.getSecondCatRdoOption()
        this.secondImports = this.user.rdos.second.imports
        this.secondRegionsOfInterest = this.user.rdos.second.regionsOfInterest
        this.needSecondRdo = true
      }
      if (this.user.rdos.third) {
        this.thirdRdosMacrocategory = macroOpt.find((item) => { return item.position === 'third' }).macro
        await this.getThirdCatRdoOption()
        this.thirdImports = this.user.rdos.third.imports
        this.thirdRegionsOfInterest = this.user.rdos.third.regionsOfInterest
        this.needThirdRdo = true
      }
      let catOpt = []
      catOpt = this.loadEditProfileOptions('firstCatRdo', catOpt)
      this.firstRdosCategories = catOpt.filter((item, i, ar) => ar.indexOf(item) === i) // unique
      await this.getFirstSubcatRdoOption()
      if (this.user.rdos.second) {
        catOpt = []
        catOpt = this.loadEditProfileOptions('secondCatRdo', catOpt)
        this.secondRdosCategories = catOpt.filter((item, i, ar) => ar.indexOf(item) === i) // unique
        await this.getSecondSubcatRdoOption()
      }
      if (this.user.rdos.third) {
        catOpt = []
        catOpt = this.loadEditProfileOptions('thirdCatRdo', catOpt)
        this.thirdRdosCategories = catOpt.filter((item, i, ar) => ar.indexOf(item) === i) // unique
        await this.getThirdSubcatRdoOption()
      }
      let subOpt = []
      subOpt = this.loadEditProfileOptions('firstSubRdo', subOpt)
      this.firstRdosSubcategories = subOpt.filter((item, i, ar) => ar.indexOf(item) === i) // unique
      if (this.user.rdos.second) {
        subOpt = []
        subOpt = this.loadEditProfileOptions('secondSubRdo', subOpt)
        this.secondRdosSubcategories = subOpt.filter((item, i, ar) => ar.indexOf(item) === i) // unique
      }
      if (this.user.rdos.third) {
        subOpt = []
        subOpt = this.loadEditProfileOptions('thirdSubRdo', subOpt)
        this.thirdRdosSubcategories = subOpt.filter((item, i, ar) => ar.indexOf(item) === i) // unique
      }
    },
    loadEditProfileOptions (key, array) {
      Object.entries(this.user.rdos).forEach((obj) => {
        obj[1].subCategory.forEach((rdo) => {
          this[key].forEach((item) => {
            if (obj[0] === 'first') {
              if (key === 'macroRdo') {
                if (item._id === rdo.macrocategory) {
                  const tmpObj = {
                    position: obj[0],
                    macro: item
                  }
                  const isFound = array.some((macro) => { return macro.position === 'first' })
                  if (!isFound || array.length === 0) {
                    array.push(tmpObj)
                  }
                }
              }
              if (key === 'firstCatRdo') {
                if (item._id === rdo.category) {
                  array.push(item)
                }
              }
              if (key === 'firstSubRdo') {
                if (item._id === rdo._id) {
                  array.push(item)
                }
              }
            } else if (obj[0] === 'second') {
              if (key === 'macroRdo') {
                if (item._id === rdo.macrocategory) {
                  const tmpObj = {
                    position: obj[0],
                    macro: item
                  }
                  const isFound = array.some((macro) => { return macro.position === 'second' })
                  if (!isFound || array.length === 0) {
                    array.push(tmpObj)
                  }
                }
              }
              if (key === 'secondCatRdo') {
                if (item._id === rdo.category) {
                  array.push(item)
                }
              }
              if (key === 'secondSubRdo') {
                if (item._id === rdo._id) {
                  array.push(item)
                }
              }
            } else if (obj[0] === 'third') {
              if (key === 'macroRdo') {
                if (item._id === rdo.macrocategory) {
                  const tmpObj = {
                    position: obj[0],
                    macro: item
                  }
                  const isFound = array.some((macro) => { return macro.position === 'third' })
                  if (!isFound || array.length === 0) {
                    array.push(tmpObj)
                  }
                }
              }
              if (key === 'thirdCatRdo') {
                if (item._id === rdo.category) {
                  array.push(item)
                }
              }
              if (key === 'thirdSubRdo') {
                if (item._id === rdo._id) {
                  array.push(item)
                }
              }
            }
          })
        })
      })
      return array
    },
    loadUserLoggedFile () {
      if (this.user.soaFile) {
        this.soaToggle = true
        this.soaFile = new File([''], 'Soa')
      }
      if (this.user.isoFile) {
        this.isoToggle = true
        this.isoFile = new File([''], 'Iso')
      }
      if (this.user.fgasFile) {
        this.fgasToggle = true
        this.fgasFile = new File([''], 'Fgas')
      }
      this.antimafiaFile = new File([''], 'Antimafia')
      this.lendingFile = new File([''], 'Presentazione')
      this.certificateFile = new File([''], 'Visura Camerale')
      this.durcRegolarityFile = new File([''], 'Durc')
    },
    goToPrivacy () {
      const routeData = this.$router.resolve({ name: 'termCondition' })
      window.open(routeData.href, '_blank')
    },
    goToTeC () {
      const routeData = this.$router.resolve({ name: 'termCondition' })
      window.open(routeData.href, '_blank')
    },
    hideDialog () {
      this.$emit('update:showAlert', this.alert)
    },
    calendarOptionCertificate (date) {
      const currentTime = new Date()
      const expirationTime = new Date()
      this.addMonths(expirationTime, 6)
      return (date >= currentTime.toLocaleDateString('fr-CA').replaceAll('-', '/') && date <= expirationTime.toLocaleDateString('fr-CA').replaceAll('-', '/'))
    },
    calendarOptionDurc (date) {
      const currentTime = new Date()
      const expirationTime = new Date()
      this.addMonths(expirationTime, 4)
      return (date >= currentTime.toLocaleDateString('fr-CA').replaceAll('-', '/') && date <= expirationTime.toLocaleDateString('fr-CA').replaceAll('-', '/'))
    },
    addMonths (date, months) {
      var d = date.getDate()
      date.setMonth(date.getMonth() + +months)
      if (date.getDate() !== d) {
        date.setDate(0)
      }
      return date
    },
    async onSignup () {
      const tempCertificateDate = this.user.certificateDate
      const tempDurcRegolarityDate = this.user.durcRegolarityDate
      if ((!this.$v.$invalid && this.step === 3) || (!this.$v.$invalid && this.step === 2 && this.isEditing)) {
        this.step = 1
        if (this.firstRdosSubcategories && this.firstRdosSubcategories.length > 0) {
          this.user.rdos.first = {}
          this.user.rdos.first.subCategory = this.firstRdosSubcategories
          this.user.rdos.first.imports = this.firstImports
          this.user.rdos.first.regionsOfInterest = this.firstRegionsOfInterest
        }
        if (this.secondRdosSubcategories && this.secondRdosSubcategories.length > 0) {
          this.user.rdos.second = {}
          this.user.rdos.second.subCategory = this.secondRdosSubcategories
          this.user.rdos.second.imports = this.secondImports
          this.user.rdos.second.regionsOfInterest = this.secondRegionsOfInterest
        }
        if (this.thirdRdosSubcategories && this.thirdRdosSubcategories.length > 0) {
          this.user.rdos.third = {}
          this.user.rdos.third.subCategory = this.thirdRdosSubcategories
          this.user.rdos.third.imports = this.thirdImports
          this.user.rdos.third.regionsOfInterest = this.thirdRegionsOfInterest
        }
        this.$q.loading.show()
        try {
          this.user.certificateDate = date.addToDate(date.extractDate(this.user.certificateDate, 'DD/MM/YYYY'), { hours: 2 })
          this.user.durcRegolarityDate = date.addToDate(date.extractDate(this.user.durcRegolarityDate, 'DD/MM/YYYY'), { hours: 2 })
          let data = {}
          if (!this.isEditing) {
            data = await this.signup(this.user)
          } else {
            data.user = this.user
          }
          await this.postFilesAndUpdateUser(data.user) // this function update user if isEditing is true
          if (this.isEditing) {
            this.$emit('editSuccess', false)
          }
          if (this.isAdmin) {
            this.$emit('editSelectedUserSuccess')
          }
          this.user.certificateDate = tempCertificateDate
          this.user.durcRegolarityDate = tempDurcRegolarityDate
          this.$q.loading.hide()
          if (!this.isEditing) {
            this.$emit('signupSuccess', false)
          }
        } catch (error) {
          this.user.certificateDate = tempCertificateDate
          this.user.durcRegolarityDate = tempDurcRegolarityDate
          this.$q.loading.hide()
          console.log(error)
        }
      }
      this.$refs.stepper.next()
    },
    async postFilesAndUpdateUser (user) {
      const formData = new FormData()
      let needUploadFile = false
      const fileToRemove = []
      if (this.antimafiaFile.size > 0) {
        const antimafiaFileSlipt = this.antimafiaFile.name.split('.')
        const antimafiaFileType = antimafiaFileSlipt[antimafiaFileSlipt.length - 1]
        formData.append('file', this.antimafiaFile, `antimafiaFile.${antimafiaFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.antimafiaFile && this.user.antimafiaFile.Key) {
          fileToRemove.push(this.user.antimafiaFile.Key)
        }
      }
      if (this.lendingFile.size > 0) {
        const lendingFileSlipt = this.lendingFile.name.split('.')
        const lendingFileType = lendingFileSlipt[lendingFileSlipt.length - 1]
        formData.append('file', this.lendingFile, `lendingFile.${lendingFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.lendingFile && this.user.lendingFile.Key) {
          fileToRemove.push(this.user.lendingFile.Key)
        }
      }
      if (this.certificateFile.size > 0) {
        const certificateFileSlipt = this.certificateFile.name.split('.')
        const certificateFileType = certificateFileSlipt[certificateFileSlipt.length - 1]
        formData.append('file', this.certificateFile, `certificateFile.${certificateFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.certificateFile && this.user.certificateFile.Key) {
          fileToRemove.push(this.user.certificateFile.Key)
        }
      }
      if (this.durcRegolarityFile.size > 0) {
        const durcRegolarityFileSlipt = this.durcRegolarityFile.name.split('.')
        const durcRegolarityFileType = durcRegolarityFileSlipt[durcRegolarityFileSlipt.length - 1]
        formData.append('file', this.durcRegolarityFile, `durcRegolarityFile.${durcRegolarityFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.durcRegolarityFile && this.user.durcRegolarityFile.Key) {
          fileToRemove.push(this.user.durcRegolarityFile.Key)
        }
      }
      if (this.soaFile && this.soaFile.size > 0) {
        const soaFileSlipt = this.soaFile.name.split('.')
        const soaFileType = soaFileSlipt[soaFileSlipt.length - 1]
        formData.append('file', this.soaFile, `soaFile.${soaFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.soaFile && this.user.soaFile.Key) {
          fileToRemove.push(this.user.soaFile.Key)
        }
      }
      if (this.isoFile && this.isoFile.size > 0) {
        const isoFileSlipt = this.isoFile.name.split('.')
        const isoFileType = isoFileSlipt[isoFileSlipt.length - 1]
        formData.append('file', this.isoFile, `isoFile.${isoFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.isoFile && this.user.isoFile.Key) {
          fileToRemove.push(this.user.isoFile.Key)
        }
      }
      if (this.fgasFile && this.fgasFile.size > 0) {
        const fgasFileSlipt = this.fgasFile.name.split('.')
        const fgasFileType = fgasFileSlipt[fgasFileSlipt.length - 1]
        formData.append('file', this.fgasFile, `fgasFile.${fgasFileType}`)
        needUploadFile = true
        if (this.isEditing && this.user.fgasFile && this.user.fgasFile.Key) {
          fileToRemove.push(this.user.fgasFile.Key)
        }
      }
      if (needUploadFile) {
        if (fileToRemove.length > 0) {
          const obj = {
            pathParam: this.user._id,
            body: fileToRemove
          }
          await this.deleteFiles(obj)
        }
        const uploadedFiles = await this.uploadFile(formData)
        uploadedFiles.files.forEach((file) => {
          user[file.Key.split('.')[1]] = file
        })
      }
      if (this.isEditing) {
        let obj = {
          pathParam: user._id,
          body: user
        }
        await this.updateLoggedUser(obj)
        obj = {
          pathParam: user._id
        }
        if (!this.isAdmin) {
          await this.fetchUser(obj)
        }
      } else {
        await this.postUser(user)
      }
    },
    async postUser (user) {
      const obj = { pathParam: user._id }
      obj.body = user
      await this.updateUser(obj)
    },
    async getRegionOptions () {
      if (this.user.region) this.user.region = undefined
      if (this.user.province) this.user.province = undefined
      if (this.user.city) this.user.city = undefined
      await this.getRegions(this.user.country._id)
    },
    async getProvinceOptions () {
      if (this.user.province) this.user.province = undefined
      if (this.user.city) this.user.city = undefined
      await this.getProvinces(this.user.region._id)
    },
    async getCityOptions () {
      if (this.user.city) this.user.city = undefined
      await this.getCities(this.user.province._id)
    },
    async getFirstCatRdoOption () {
      if (!this.firstRdosMacrocategory) {
        this.firstRdosCategories = []
        this.firstRdosSubcategories = []
      } else {
        const obj = {
          order: 'first',
          queryparams: { rdomacroId: this.firstRdosMacrocategory._id }
        }
        await this.getCatRdo(obj)
      }
    },
    async getSecondCatRdoOption () {
      if (!this.secondRdosMacrocategory) {
        this.secondRdosCategories = []
        this.secondRdosSubcategories = []
      } else {
        const obj = {
          order: 'second',
          queryparams: { rdomacroId: this.secondRdosMacrocategory._id }
        }
        await this.getCatRdo(obj)
      }
    },
    async getThirdCatRdoOption () {
      if (!this.thirdRdosMacrocategory) {
        this.thirdRdosCategories = []
        this.thirdRdosSubcategories = []
      } else {
        const obj = {
          order: 'third',
          queryparams: { rdomacroId: this.thirdRdosMacrocategory._id }
        }
        await this.getCatRdo(obj)
      }
    },
    async getFirstSubcatRdoOption () {
      if (this.firstRdosCategories && this.firstRdosCategories.length === 0) {
        this.firstRdosSubcategories = []
      }
      const obj = {
        order: 'first',
        queryparams: { rdocatId: this.firstRdosCategories.map((rdoCat) => { return rdoCat._id }) }
      }
      await this.getSubRdo(obj)
    },
    async getSecondSubcatRdoOption () {
      if (this.secondRdosCategories && this.secondRdosCategories.length === 0) {
        this.secondRdosSubcategories = []
      }
      const obj = {
        order: 'second',
        queryparams: { rdocatId: this.secondRdosCategories.map((rdoCat) => { return rdoCat._id }) }
      }
      await this.getSubRdo(obj)
    },
    async getThirdSubcatRdoOption () {
      if (this.thirdRdosCategories && this.thirdRdosCategories.length === 0) {
        this.thirdRdosSubcategories = []
      }
      const obj = {
        order: 'third',
        queryparams: { rdocatId: this.thirdRdosCategories.map((rdoCat) => { return rdoCat._id }) }
      }
      await this.getSubRdo(obj)
    }
  },
  async mounted () {
    await this.getCountries()
    this.user.country = this.countries.find((country) => {
      return country.description === 'Italia'
    })
    await this.getRegionOptions()
    await this.getMacroRdo()
    if (this.isEditing) {
      await this.buildEditProfilePage()
    }
    this.$v.$touch()
  },
  computed: {
    ...mapGetters({
      userLogged: 'user',
      countries: 'countries',
      regions: 'regions',
      provinces: 'provinces',
      cities: 'cities',
      macroRdo: 'macroRdo',
      firstCatRdo: 'firstCatRdo',
      secondCatRdo: 'secondCatRdo',
      thirdCatRdo: 'thirdCatRdo',
      firstSubRdo: 'firstSubRdo',
      secondSubRdo: 'secondSubRdo',
      thirdSubRdo: 'thirdSubRdo'
    }),
    getBtnLabel () {
      if (this.step === 2 && this.isEditing) {
        return 'Modifica'
      } else if (this.step === 3) {
        return 'Registrati'
      } else {
        return 'Continua'
      }
    }
  },
  watch: {
    showAlert (newValue, oldValue) {
      if (oldValue !== newValue) {
        this.alert = newValue
      }
    },
    firstRdosMacrocategory (newValue, oldValue) {
      if (oldValue !== newValue) {
        this.firstRdosCategories = []
        this.firstRdosSubcategories = []
      }
    }
  },
  validations () {
    return {
      user: {
        companyName: {
          required
        },
        SDICode: {
          required,
          isSDICode: validator.isSDICode
        },
        vatNumber: {
          required,
          isVatNumber: validator.isVatNumber
        },
        fiscalCode: {
          required,
          isFiscalCode: validator.isFiscalCode
        },
        country: {
          required
        },
        region: {
          required
        },
        province: {
          required
        },
        city: {
          required
        },
        registeredOfficeAddress: {
          required
        },
        postalCode: {
          required,
          isPostalCode: validator.isPostalCode
        },
        webSite: {
          isWebSite: this.user.webSite !== '' ? validator.isWebSite : true
        },
        pec: {
          email,
          required
        },
        telephoneNumber: {
          required,
          isTelephoneNumber: validator.isTelephoneNumber
        },
        username: {
          required,
          email
        },
        password: {
          required: this.isEditing ? false : required,
          isPassword: this.isEditing ? true : validator.isPassword
        },
        durcRegolarityDate: {
          required
        },
        certificateDate: {
          required
        }
      },
      firstRdosSubcategories: {
        required
      },
      firstRdosMacrocategory: {
        required
      },
      firstRdosCategories: {
        required
      },
      firstImports: {
        required
      },
      firstRegionsOfInterest: {
        required
      },
      secondRdosSubcategories: {
        required: !this.needSecondRdo ? false : required
      },
      secondRdosMacrocategory: {
        required: !this.needSecondRdo ? false : required
      },
      secondRdosCategories: {
        required: !this.needSecondRdo ? false : required
      },
      secondImports: {
        required: !this.needSecondRdo ? false : required
      },
      secondRegionsOfInterest: {
        required: !this.needSecondRdo ? false : required
      },
      thirdRdosSubcategories: {
        required: !this.needThirdRdo ? false : required
      },
      thirdRdosMacrocategory: {
        required: !this.needThirdRdo ? false : required
      },
      thirdRdosCategories: {
        required: !this.needThirdRdo ? false : required
      },
      thirdImports: {
        required: !this.needThirdRdo ? false : required
      },
      thirdRegionsOfInterest: {
        required: !this.needThirdRdo ? false : required
      },
      durcRegolarityFile: {
        required
      },
      antimafiaFile: {
        required
      },
      certificateFile: {
        required
      },
      lendingFile: {
        required
      }
    }
  }
}
</script>

<style scoped>
</style>

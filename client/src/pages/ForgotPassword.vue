<template>
  <div style="min-width: 330px" class="q-pa-lg">
    <q-form @submit.prevent.stop="onSubmit" class="q-gutter-md">
      <q-input v-model="password"
               :type="isPwd ? 'password' : 'text'"
               name="password"
               label="Nuova password"
               outlined
               reactive-rules
               :rules="[ (val) => isValid('password', val, $v) ]">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="q-mt-lg q-pt-lg">
        <q-btn push
               :ripple="false"
               class="full-width"
               label="Reimposta password"
               color="secondary"
               type='submit'/>
      </div>
    </q-form>
  </div>
</template>

<script>
import validator from 'src/validations/validator'
import { required } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  name: 'ForgotPassword',
  data () {
    return {
      userId: undefined,
      password: undefined,
      isValid: validator.isValid,
      isPassword: validator.isPassword,
      isPwd: true
    }
  },
  methods: {
    ...mapActions([
      'resetPassword'
    ]),
    async onSubmit () {
      this.$v.$touch()
      this.$forceUpdate()
      if (!this.$v.$invalid) {
        this.$q.loading.show()
        const obj = {
          body: {
            id: this.userId,
            password: this.password
          }
        }
        await this.resetPassword(obj)
        this.$q.loading.hide()
      }
    }
  },
  mounted () {
    this.userId = this.$route.params.userId
  },
  validations () {
    return {
      password: {
        required: required,
        isPassword: validator.isPassword
      }
    }
  }
}
</script>

<style scoped>

</style>

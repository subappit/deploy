<template>
  <q-form @submit.prevent.stop="onSubmit">
    <div class="row justify-center content-center no-padding no-margin q-gutter-x-md q-gutter-y-lg">
      <h5 class="text-center col-12 no-margin q-pt-lg">Reimposta password</h5>
      <q-input v-model="password"
               :type="isPwd ? 'password' : 'text'"
               name="password"
               label="Nuova password"
               class="col-12 col-md-6"
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
      <div class="col-12 col-md-6 text-center">
        <q-btn push
               :ripple="false"
               label="Reimposta password"
               color="secondary"
               type='submit'/>
      </div>
    </div>
  </q-form>
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
        await this.$router.push('/')
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

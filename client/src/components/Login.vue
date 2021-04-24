<template>
  <div style="min-width: 330px" class="q-pa-lg">
    <q-form v-if="!isForgottenPassword" @submit.prevent.stop="onSubmit" class="q-gutter-md">
      <q-input v-model="user.username"
               type="text"
               name="username"
               label="Username"
               autocomplete="none"
               outlined
               reactive-rules
               :rules="[ (val) => isValid('username', val, $v.user) ]" />
      <q-input v-model="user.password"
               :type="isPwd ? 'password' : 'text'"
               name="password"
               label="Password"
               outlined
               reactive-rules
               :rules="[ (val) => isValid('password', val, $v.user) ]">
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
               label="Log In"
               color="secondary"
               type='submit'/>
        <a class="q-pt-md block text-center cursor-pointer text-accent bold text-weight-bold" @click="isForgottenPassword = true">Password dimenticata?</a>
      </div>
    </q-form>
    <q-form v-if="isForgottenPassword" @submit.prevent.stop="doForgottenPassword" class="q-gutter-md">
      <q-input v-model="email"
               type="text"
               name="email"
               label="Username (email)"
               autocomplete="none"
               outlined
               reactive-rules
               :rules="[ (val) => isValid('email', val, $v) ]" />

      <div class="q-mt-lg q-pt-lg">
        <q-btn push
               :ripple="false"
               class="full-width"
               label="Continua"
               color="secondary"
               type='submit'/>
        <a class="q-pt-md block text-center cursor-pointer text-accent bold text-weight-bold" @click="isForgottenPassword = false">Indietro</a>
      </div>
    </q-form>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { required, email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import validator from 'src/validations/validator'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      isForgottenPassword: false,
      user: {
        username: '',
        password: ''
      },
      isValid: validator.isValid,
      isPassword: validator.isPassword,
      isPwd: true
    }
  },
  methods: {
    ...mapActions([
      'login',
      'forgottenPassword'
    ]),
    async doForgottenPassword () {
      this.$v.$touch()
      this.$forceUpdate()
      if (!this.$v.$invalid) {
        this.$q.loading.show()
        const obj = {
          queryparams: {
            email: this.email
          }
        }
        await this.forgottenPassword(obj)
        this.$emit('loginSuccess', false)
        this.$q.loading.hide()
      }
    },
    async onSubmit () {
      this.$v.$touch()
      this.$forceUpdate()
      if (!this.$v.$invalid) {
        this.$q.loading.show()
        const { user } = await this.login(this.user)
        if (!user.blocked) {
          await this.$router.push('/board')
        }
        this.$emit('loginSuccess', false)
        this.$q.loading.hide()
      }
    }
  },
  validations () {
    if (this.isForgottenPassword) {
      return {
        email: {
          required: required,
          email
        }
      }
    } else {
      return {
        user: {
          username: {
            required: required,
            email: email
          },
          password: {
            required: required,
            isPassword: validator.isPassword
          }
        }
      }
    }
  }
}

</script>

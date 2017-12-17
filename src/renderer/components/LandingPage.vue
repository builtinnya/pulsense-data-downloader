<template>
  <div id="wrapper">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            PULSENSE Data Downloader
          </h1>
          <h2 class="subtitle">
            This app is <strong>UNOFFICIAL.</strong> We just need it.
          </h2>
        </div>
      </div>
    </section>
    <section class="login">
      <div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left has-icons-right">
            <input
              :class="{ input: true, 'is-danger': emailError }"
              type="email"
              placeholder="Email"
              v-bind:value="email"
              @input="handleInputEmail"
              required
            />
            <span class="icon is-small is-left">
              <i class="fa fa-envelope"></i>
            </span>
          </div>
          <p class="help is-danger" v-if="emailError">{{ emailError }}</p>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              :class="{ input: true, 'is-danger': passwordError }"
              type="password"
              placeholder="Password"
              v-bind:value="password"
              @input="handleInputPassword"
              required
            />
            <span class="icon is-small is-left">
              <i class="fa fa-key"></i>
            </span>
          </div>
          <p class="help is-danger" v-if="passwordError">{{ passwordError }}</p>
        </div>
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button is-primary" v-bind:disabled="isLoading()" @click="login">
              <span v-if="isLoading()"><i class="fa fa-spinner fa-spin"></i>&nbsp;</span> Login
            </button>
          </div>
        </div>
        <div class="notification is-danger" v-if="hasFailed()">
          Login failed
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import validator from 'validator'

  const data = {
    email: '',
    emailError: '',
    password: '',
    passwordError: ''
  }

  export default {
    name: 'landing-page',
    components: {},
    data () {
      return data
    },
    watch: {
      '$store.state.Auth.status': function (newStatus) {
        if (newStatus === 'success') {
          this.$router.push('/download')
        }
      }
    },
    methods: {
      login () {
        if (!this.validate()) {
          return
        }

        this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        }).then(() => {
          this.password = ''
          this.passwordError = ''
        })
      },

      handleInputEmail (event) {
        this.email = event.target.value

        this.validateEmail()
      },

      handleInputPassword (event) {
        this.password = event.target.value

        this.validatePassword()
      },

      validateEmail () {
        if (!this.email) {
          this.emailError = 'Required'

          return false
        }

        if (!validator.isEmail(this.email)) {
          this.emailError = 'Invalid'

          return false
        }

        this.emailError = ''

        return true
      },

      validatePassword () {
        if (!this.password) {
          this.passwordError = 'Required'

          return false
        }

        this.passwordError = ''

        return true
      },

      validate () {
        return this.validateEmail() && this.validatePassword()
      },

      isLoading () {
        return this.$store.getters.isAuthLoading
      },

      hasFailed () {
        return this.$store.getters.hasAuthFailed
      }
    }
  }
</script>

<style lang="scss">
  .login {
    margin: 20px auto;
    max-width: 512px;
  }
</style>

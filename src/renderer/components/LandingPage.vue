<template>
  <div id="wrapper">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            PULSENSE Data Downloader
          </h1>
          <h2 class="subtitle">
            We just need it.
          </h2>
        </div>
      </div>
    </section>
    <section class="login">
      <form ref="loginForm" @submit.prevent="login">
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
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
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
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
        </div>
        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button is-primary" v-bind:disabled="isLoading()">
              <span v-if="isLoading()"><i class="fa fa-spinner fa-spin"></i>&nbsp;</span> Login
            </button>
          </div>
        </div>
        <div class="notification is-danger" v-if="hasFailed()">
          ログインに失敗しました
        </div>
      </form>
    </section>
  </div>
</template>

<script>
  const data = {
    email: '',
    password: ''
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
      login (event) {
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })
      },

      handleInputEmail (event) {
        this.email = event.target.value
      },

      handleInputPassword (event) {
        this.password = event.target.value
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

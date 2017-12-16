<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <strong>PULSENSE Data Downloader</strong>
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="#">
            {{ email }}
          </a>
          <div class="navbar-dropdown is-right">
            <hr class="navbar-divider">
            <a class="navbar-item" href="#" @click="logout">
              Logout
            </a>
          </div>
        </div>
        <div class="navbar-item">
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'navbar',
    watch: {
      '$store.state.Auth.status': function (newStatus) {
        if (newStatus === 'initial') {
          this.$router.push('/')
        }
      }
    },
    computed: {
      email () {
        return this.$store.getters.email
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style lang="scss">
</style>

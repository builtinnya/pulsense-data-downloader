<template>
  <div id="wrapper">
    <navbar></navbar>
    <section class="section">
      <div class="container">
        <h1 class="title">Download Stress Data</h1>
        <h2 class="subtitle">
          Enter the <strong>date range</strong> and click a button to download your stress data.
        </h2>
      </div>
    </section>
  </div>
</template>

<script>
  import Navbar from './common/Navbar'

  export default {
    name: 'download-page',
    components: {
      Navbar
    },
    methods: {}
  }
</script>

<style lang="scss">
</style>

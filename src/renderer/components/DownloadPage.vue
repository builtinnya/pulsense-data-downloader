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
      <div class="container">
        <div class="stress-data-download-form">
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <label class="label">From</label>
                <p class="control is-expanded has-icons-left">
                  <input class="input" type="text" placeholder="e.g. 2018/01/01" @input="handleInputDateFrom">
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>
                </p>
              </div>
              <div class="field">
                <label class="label">To</label>
                <p class="control is-expanded has-icons-left has-icons-right">
                  <input class="input" type="text" placeholder="e.g. 2018/02/01" @input="handleInputDateTo">
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>
                </p>
              </div>
              <div class="field">
                <label class="label">Download</label>
                <div class="control">
                  <button class="button is-primary" @click="openStressDataModal">
                    <span v-if="false">
                      <i class="fa fa-spinner fa-spin"></i>&nbsp;
                    </span>
                    <span v-else>
                      <i class="fa fa-download"></i>&nbsp;
                    </span>
                    CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div ref="stressDataModal" v-bind:class="{ modal: true, 'is-active': isModalOpen }">
      <div class="modal-background" @click="closeStressDataModal"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Download Stress Data in CSV
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <p>
                You are going to download your stress data:
              </p>
              <p class="is-center">
                from <strong>{{ formattedDateFrom }}</strong> to <strong>{{ formattedDateTo }}</strong> (inclusive).
              </p>
              <div class="output-dir-form">
                <div class="file has-name">
                  <label class="file-label">
                    <input class="file-input" type="file" webkitdirectory @change="handleChangeOutputDir">
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fa fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Choose a directory…
                      </span>
                    </span>
                    <span class="file-name">
                      {{ outputDir || 'Please choose one' }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item" @click="closeStressDataModal">Cancel</a>
            <a href="#" class="card-footer-item" @click="download">Download</a>
          </footer>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeStressDataModal"></button>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  import Navbar from './common/Navbar'

  const data = {
    isModalOpen: false,
    dateFrom: '',
    dateTo: '',
    outputDir: ''
  }

  const formatDate = (date) => moment(date).format('YYYY/MM/DD')

  export default {
    name: 'download-page',
    components: {
      Navbar
    },
    data () {
      return data
    },
    computed: {
      formattedDateFrom () {
        return formatDate(this.dateFrom)
      },

      formattedDateTo () {
        return formatDate(this.dateTo)
      }
    },
    methods: {
      openStressDataModal () {
        this.isModalOpen = true
      },

      closeStressDataModal () {
        this.isModalOpen = false
      },

      handleInputDateFrom (event) {
        this.dateFrom = event.target.value
      },

      handleInputDateTo (event) {
        this.dateTo = event.target.value
      },

      handleChangeOutputDir (event) {
        if (!event.target.files[0]) {
          return
        }

        this.outputDir = event.target.files[0].path
      },

      download () {
        this.$store.dispatch('download', {
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          outputDir: this.outputDir
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .stress-data-download-form {
    margin: 23px auto;
  }

  .output-dir-form {
    margin: 10px auto;
  }

  .is-center {
    text-align: center;
  }
</style>

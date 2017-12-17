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
        <div class="stress-data-download-container">
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <label class="label">From</label>
                <p class="control is-expanded has-icons-left">
                  <input
                    :class="{ input: true, 'is-danger': dateFromError }"
                    type="text"
                    placeholder="e.g. 2018/01/01"
                    :value="dateFrom"
                    @input="handleInputDateFrom"
                  />
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>
                </p>
                <p class="help is-danger" v-if="dateFromError">{{ dateFromError }}</p>
              </div>
              <div class="field">
                <label class="label">To</label>
                <p class="control is-expanded has-icons-left has-icons-right">
                  <input
                    :class="{ input: true, 'is-danger': dateToError }"
                    type="text"
                    placeholder="e.g. 2018/02/01"
                    :value="dateTo"
                    @input="handleInputDateTo"
                  />
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>
                </p>
                <p class="help is-danger" v-if="dateToError">{{ dateToError }}</p>
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
          <div class="progress-container" v-if="!isDownloadingInitial">
            <progress
              :class="{ progress: true, 'is-medium': true, 'is-primary': isDownloading, 'is-success': hasDownloadingSucceeded, 'is-danger': hasDownloadingFailed }"
              :value="downloadingProgressCount"
              :max="downloadingProgressTotal"
            >
              {{ `${downloadingProgressCount} / ${downloadingProgressTotal}` }}
            </progress>
            <p>
              {{ downloadingProgressMessage }}
            </p>
          </div>
          <div class="notification is-danger" v-if="hasDownloadingFailed">
            Downloading failed
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
              <div class="output-dir-container">
                <div :class="{ file: true, 'has-name': true, 'is-danger': outputDirError }">
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
    dateFromError: '',
    dateTo: '',
    dateToError: '',
    outputDir: '',
    outputDirError: ''
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
      },

      isDownloadingInitial () {
        return this.$store.getters.isDownloadingInitial
      },

      isDownloading () {
        return this.$store.getters.isDownloading
      },

      hasDownloadingSucceeded () {
        return this.$store.getters.hasDownloadingSucceeded
      },

      hasDownloadingFailed () {
        return this.$store.getters.hasDownloadingFailed
      },

      downloadingProgressMessage () {
        return this.$store.getters.downloadingProgressMessage
      },

      downloadingProgressCount () {
        return this.$store.getters.downloadingProgressCount
      },

      downloadingProgressTotal () {
        return this.$store.getters.downloadingProgressTotal
      }
    },
    mounted () {
      this.isModalOpen = false
      this.dateFrom = ''
      this.dateFromError = ''
      this.dateTo = ''
      this.dateToError = ''
      this.outputDir = ''
      this.outputDirError = ''

      this.$store.dispatch('initDownloader')
    },
    methods: {
      openStressDataModal () {
        if (!this.validateDateRange()) {
          return
        }

        this.isModalOpen = true
      },

      closeStressDataModal () {
        this.isModalOpen = false
      },

      handleInputDateFrom (event) {
        this.dateFrom = event.target.value

        this.validateDateFrom()
      },

      handleInputDateTo (event) {
        this.dateTo = event.target.value

        this.validateDateTo()
      },

      handleChangeOutputDir (event) {
        if (!event.target.files[0]) {
          return
        }

        this.outputDir = event.target.files[0].path

        this.validateOutputDir()
      },

      validateDateFrom () {
        this.dateFromError = moment(this.dateFrom).isValid() ? '' : 'Invalid date'

        return !this.dateFromError
      },

      validateDateTo () {
        this.dateToError = moment(this.dateTo).isValid() ? '' : 'Invalid date'

        return !this.dateToError
      },

      validateDateRange () {
        return this.validateDateFrom() && this.validateDateTo()
      },

      validateOutputDir () {
        if (!this.outputDir) {
          this.outputDirError = 'Required'

          return false
        }

        this.outputDirError = ''

        return true
      },

      download () {
        if (!this.validateDateRange()) {
          this.isModalOpen = false

          return
        }

        if (!this.validateOutputDir()) {
          return
        }

        this.isModalOpen = false

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
  .stress-data-download-container {
    margin: 23px auto;
  }

  .output-dir-container {
    margin: 10px auto;
  }

  .progress-container {
    margin: 25px auto;
  }

  .is-center {
    text-align: center;
  }
</style>

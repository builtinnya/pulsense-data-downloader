import moment from 'moment'

import api from '../../api/epson'

const state = {
  status: 'initial',
  error: null,
  progress: {
    message: '',
    processedCount: 0,
    totalCount: 0
  }
}

const getters = {
  isDownloadingInitial: (state) => state.status === 'initial',
  isDownloading: (state) => state.status === 'loading',
  hasDownloadingFailed: (state) => state.status === 'failed',
  hasDownloadingSucceeded: (state) => state.status === 'success',
  downloadingProgressMessage: (state) => state.progress.message,
  downloadingProgressCount: (state) => state.progress.processedCount,
  downloadingProgressTotal: (state) => state.progress.totalCount
}

const mutations = {
  DOWNLOAD (state) {
    state.status = 'loading'
    state.progress.message = ''
    state.progress.processedCount = 0
    state.progress.totalCount = 0
  },

  DOWNLOAD_SUCCESS (state) {
    state.status = 'success'
  },

  DOWNLOAD_FAILURE (state, { error }) {
    state.status = 'failed'
    state.error = error
  },

  PROGRESS (state, { date, outputFile, processedCount, totalCount }) {
    if (processedCount === totalCount) {
      state.progress.message = 'Done.'
    } else {
      state.progress.message = `Processing ${moment(date).format('YYYY/MM/DD')}… (output to ${outputFile})`
    }

    state.progress.processedCount = processedCount
    state.progress.totalCount = totalCount
  }
}

const actions = {
  download ({ commit }, { dateFrom, dateTo, outputDir }) {
    commit('DOWNLOAD')

    return api.download({
      dateFrom,
      dateTo,
      outputDir,
      onProgress: ({ date, outputFile, processedCount, totalCount }) => {
        commit('PROGRESS', { date, outputFile, processedCount, totalCount })
      }
    }).then(() => {
      commit('DOWNLOAD_SUCCESS')
    }).catch((error) => {
      console.log(error)

      commit('DOWNLOAD_FAILURE', { error })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

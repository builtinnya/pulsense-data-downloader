import api from '../../api/epson'

const state = {
  status: 'initial',
  error: null
}

const getters = {
  isDownloading: (state) => state.status === 'loading'
}

const mutations = {
  DOWNLOAD (state) {
    state.status = 'loading'
  },

  DOWNLOAD_SUCCESS (state) {
    state.status = 'success'
  },

  DOWNLOAD_FAILURE (state, { error }) {
    state.status = 'failed'
    state.error = error
  }
}

const actions = {
  download ({ commit }, { dateFrom, dateTo, outputDir }) {
    commit('DOWNLOAD')

    return api.download({
      dateFrom,
      dateTo,
      outputDir,
      onProgress: () => Promise.resolve()
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

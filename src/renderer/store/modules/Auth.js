import { remote } from 'electron'

import api from '../../api/epson'

const state = {
  status: 'initial',
  email: '',
  error: null
}

const getters = {
  isAuthLoading: (state) => state.status === 'loading',
  hasAuthFailed: (state) => state.status === 'failed',
  email: (state) => state.email
}

const mutations = {
  LOGIN (state) {
    state.status = 'loading'
  },

  LOGIN_SUCCESS (state, { email }) {
    state.status = 'success'
    state.email = email
  },

  LOGIN_FAILURE (state) {
    state.status = 'failed'
  },

  LOGOUT (state) {
    state.status = 'loggingOut'
  },

  LOGOUT_SUCCESS (state) {
    state.status = 'initial'
    state.email = ''
    state.error = null
  },

  LOGOUT_FAILURE (state) {
  }
}

const actions = {
  login ({ commit }, { email, password }) {
    commit('LOGIN')

    return api.login(email, password).then(() => {
      commit('LOGIN_SUCCESS', { email })
    }).catch((error) => {
      commit('LOGIN_FAILURE', { error })
    })
  },

  logout ({ commit }) {
    commit('LOGOUT')

    return api.logout().then(() => new Promise((resolve) => {
      remote.getCurrentWebContents().session.clearStorageData([], () => {
        resolve()
      })
    })).then(() => {
      commit('LOGOUT_SUCCESS')
    }).catch((error) => {
      console.log(error)

      commit('LOGOUT_FAILURE', { error })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

const PULSENSE_AUTH_ENDPOINT = 'https://go-wellness.epson.com/pulsense-view/login/'
const PULSENSE_VIEW_ENDPOINT = 'https://go-wellness.epson.com/pulsense-view/view/'
const AUTH_ENDPOINT = 'https://auth.cp.epson.com/account/login/'
// const STRESS_METER_ENDPOINT = 'https://go-wellness.epson.com/pulsense-view/view/ajaxGetStressMeterGraphDay'

function requestPulsenseLogin () {
  const params = new URLSearchParams()

  params.set('countryCode', '')
  params.set('languageCode', '')
  params.set('timeZoneOffset', '')
  params.set('accessClient', '')
  params.set('webView', '')
  params.set('k01', '')
  params.set('k02', '')
  params.set('fwdPageForIndex', '')
  params.set('tense', '')
  params.set('transition', '')
  params.set('authAccount', 'ログイン')

  return fetch(PULSENSE_AUTH_ENDPOINT, {
    method: 'post',
    credentials: 'include',
    body: params
  })
}

export default {
  login (email, password) {
    return requestPulsenseLogin().then(() => {
      const params = new URLSearchParams()

      params.set('email_address', email)
      params.set('password', password)
      params.set('login_save', true)
      params.set('login', 'ログイン')

      return fetch(AUTH_ENDPOINT, {
        method: 'post',
        credentials: 'include',
        body: params
      })
    }).then(({ url }) => {
      if (url === AUTH_ENDPOINT) {
        throw new Error('Failed to login')
      }

      return true
    })
  },

  logout () {
    const params = new URLSearchParams()

    params.set('logout', 'Submit')

    return fetch(PULSENSE_VIEW_ENDPOINT, {
      method: 'post',
      credentials: 'include',
      body: params
    })
  }
}

import fs from 'fs'
import path from 'path'
import moment from 'moment'
import json2csv from 'json2csv'

const PULSENSE_AUTH_ENDPOINT = 'https://go-wellness.epson.com/pulsense-view/login/'
const PULSENSE_VIEW_ENDPOINT = 'https://go-wellness.epson.com/pulsense-view/view/'
const AUTH_ENDPOINT = 'https://auth.cp.epson.com/account/login/'
const STRESS_METER_ENDPOINT = 'https://go-wellness.epson.com/pulsense-view/view/ajaxGetStressMeterGraphDay'

function normalizeDate (date) {
  return moment(date).format('YYYY-MM-DD')
}

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

function downloadStressData (date, outputFile) {
  const normalizedDate = normalizeDate(date)
  const url = new URL(STRESS_METER_ENDPOINT)

  const params = {
    dashboardReqFrom: normalizedDate,
    dashboardReqTo: normalizedDate,
    dashboardTargetTerm: 'day',
    dashboardTargetTermAction: 'day',
    termFormat: 'M月d日',
    terminalDate: normalizedDate,
    zoomInterval: '0'
  }

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))

  return fetch(url, {
    method: 'get',
    credentials: 'include',
    body: params
  }).then((response) => response.json()).then(({ stressDailyHrData }) => json2csv({
    data: stressDailyHrData,
    fields: ['time', 'value', 'type']
  })).then((csv) => new Promise((resolve, reject) => fs.writeFile(outputFile, csv, (err) => {
    if (err) {
      reject(err)

      return
    }

    resolve()
  })))
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

  // TODO: Figure out how to logout properly
  logout () {
    const params = new URLSearchParams()

    params.set('selectPage', '/view')
    params.set('logout', 'Submit')

    return fetch(PULSENSE_VIEW_ENDPOINT, {
      method: 'post',
      credentials: 'include',
      body: params
    })
  },

  download ({ dateFrom, dateTo, outputDir, onProgress }) {
    const totalCount = moment(dateTo).diff(dateFrom, 'days') + 1

    let p = Promise.resolve()
    let currentDate = moment(dateFrom)
    let processedCount = 0

    while (!currentDate.isAfter(dateTo)) {
      const date = moment(currentDate).clone()

      p = p.then(() => {
        const outputFile = path.join(outputDir, `stress-${normalizeDate(date)}.csv`)

        return Promise.all([
          outputFile,
          onProgress({ date, outputFile, processedCount, totalCount })
        ])
      }).then(([ outputFile ]) => downloadStressData(date, outputFile)).then(() => {
        processedCount++
      })

      currentDate.add(1, 'days')
    }

    p = p.then(() => onProgress({ processedCount, totalCount }))

    return p
  }
}

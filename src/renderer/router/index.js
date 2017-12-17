import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      beforeEnter (__, ___, next) {
        if (store.getters.email) {
          next('/download')

          return
        }

        next()
      }
    },
    {
      path: '/download',
      name: 'download-page',
      component: require('@/components/DownloadPage').default,
      beforeEnter (__, ___, next) {
        if (!store.getters.email) {
          next('/')

          return
        }

        next()
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

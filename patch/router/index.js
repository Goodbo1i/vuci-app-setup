import Vue from 'vue'
import Router from 'vue-router'
import { session } from '@/plugins/session'
import { rpc } from '@/plugins/rpc'
import axios from 'axios'
import store from '@/store/index.js'

Vue.use(Router)

/* eslint space-before-function-paren: ["error", "never"] */

const router = new Router({
  routes: [
    {
      path: '/login',
      component: (resolve) => {
        axios
          .get(`/views/vuci-app-login.js?_t=${new Date().getTime()}`)
          .then((r) => {
            // eslint-disable-next-line no-eval
            return resolve(eval(r.data))
          })
          .catch(() => {
            return resolve(require('@/views/Login.vue'))
          })
      }
    },

    {
      path: '/',
      redirect: '/home',
      component: () => import('@/components/VuciLayout'),
      children: [
        {
          path: 'home',
          component: (resolve) => {
            axios
              .get(`/views/vuci-app-home.js?_t=${new Date().getTime()}`)
              .then((r) => {
                // eslint-disable-next-line no-eval
                return resolve(eval(r.data))
              })
              .catch(() => {
                return resolve(require('@/views/Home.vue'))
              })
          },
          meta: {
            title: 'Home'
          }
        }
      ]
    },
    {
      path: '/setup',
      props: true,
      component: () => import('@/components/VuciLayout'),
      children: [
        {
          path: 'setup',
          component: (resolve) => {
            axios
              .get(`/views/vuci-app-setup.js?_t=${new Date().getTime()}`)
              .then((r) => {
                // eslint-disable-next-line no-eval
                return resolve(eval(r.data))
              })
              .catch(() => {
                return resolve(require('@/views/Setup.vue'))
              })
          },
          meta: {
            title: 'Set Up'
          }
        }
      ]
    },
    {
      path: '*',
      component: () => import('@/components/404.vue')
    }
  ]
})

async function beforeEach(to, next, alive) {
  var isFirst = await firstLogin()
  firstLogin().then((first) => {
    if (first === true) {
      store.commit('changed', true)
    }
  })
  console.log(isFirst)
  if (to.path !== '/login') {
    if (alive && isFirst) {
      next('/system/setup')
    } else if (alive) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
}

function firstLogin() {
  return new Promise((resolve) => {
    rpc.call('ui', 'first_login').then((r) => {
      resolve(r.first)
    })
  })
}

router.beforeEach((to, from, next) => {
  next()
  session.isAlive().then((alive) => {
    if (alive) session.startHeartbeat()
    else session.logout()
    beforeEach(to, next, alive)
  })
})

export default router

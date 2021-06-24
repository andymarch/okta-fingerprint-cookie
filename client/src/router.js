import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'

import { validateAccess, callback, logout } from './auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/authorization-code/callback', component: callback },
    { path: '/profile', redirect: '/profile/authorization_code' },
    { path: '/profile/:mode', beforeEnter: validateAccess, component: Profile },
    { path: '/logout', component: logout }
  ]
})

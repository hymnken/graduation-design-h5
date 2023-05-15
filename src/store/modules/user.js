import config from '../../config'
const USER_KEY = config.userInfoCacheKey || 'userInfo'
const TOKEN_KEY = config.userTokenKey || 'token'

const USERINFO = localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)) : {}
const TOKEN = localStorage.getItem(TOKEN_KEY)
import { logout, login as userLogin } from '@/api/user.js'
const state = {
  userInfo: USERINFO || {},
  token: TOKEN || '',
}

const getters = {
  userInfo: (state) => state.userInfo,
  token: (state) => state.token,
}

const mutations = {
  // 设置用户信息
  SET_USERINFO(state, info) {
    const userInfo = Object.assign({}, info || {})
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
    state.userInfo = userInfo
  },
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem(TOKEN_KEY, token)
  },
  UPDATE_USERINFO(state, info) {
    if (typeof info == 'object') {
      state.userInfo = Object.assign({}, state.userInfo, info)
    }
  },
}

const actions = {
  setUserInfo({ commit }, info) {
    commit('SET_USERINFO', info)
    commit('SET_TOKEN', info.token || '')
  },
  login({ commit, dispatch }, params) {
    return new Promise((r, j) => {
      userLogin(params)
        .then((res) => {
          commit('SET_USERINFO', res)
          commit('SET_TOKEN', res.token || '')
          r(res)
        })
        .catch((err) => {
          j(err)
        })
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then((_) => {
          commit('SET_USERINFO', {})
          commit('SET_TOKEN', '')
          return resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  clearUserInfo({ commit }) {
    return new Promise((resolve) => {
      commit('SET_USERINFO', {})
      commit('SET_TOKEN', '')
      return resolve()
    })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}

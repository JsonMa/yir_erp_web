const state = {
  user: {}
}
const getters = {
  user: (state) => {
    return state.user
  }
}

const actions = {
  updateUser ({
    commit
  }, data) {
    commit('UPDATE_USER', data)
  }
}

const mutations = {
  UPDATE_USER (state, data) {
    state.user = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

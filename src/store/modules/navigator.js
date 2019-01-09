const state = {
  navigator: ''
}
const getters = {
  navigator: (state) => {
    return state.navigator
  }
}

const actions = {
  updateNavigator ({
    commit
  }, data) {
    commit('UPDATE_NAVIGATOR', data)
  }
}

const mutations = {
  UPDATE_NAVIGATOR (state, data) {
    state.navigator = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

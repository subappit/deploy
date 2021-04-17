import optionMutations from './mutations.js'
import optionActions from './actions.js'
import optionGetters from './getters.js'

export default {
  state () {
    // inital state
    return {
      macroRdo: [],
      firstCatRdo: [],
      secondCatRdo: [],
      thirdCatRdo: [],
      firstSubRdo: [],
      secondSubRdo: [],
      thirdSubRdo: []
    }
  },
  mutations: optionMutations,
  actions: optionActions,
  getters: optionGetters
}

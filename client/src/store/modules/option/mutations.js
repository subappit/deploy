export default {
  SET_MACRORDO (state, marcoRdo) {
    state.macroRdo = marcoRdo
  },
  SET_CATRDO (state, data) {
    if (data.order === 'first') {
      state.firstCatRdo = data.catRdo
    }
    if (data.order === 'second') {
      state.secondCatRdo = data.catRdo
    }
    if (data.order === 'third') {
      state.thirdCatRdo = data.catRdo
    }
  },
  SET_SUBRDO (state, data) {
    if (data.order === 'first') {
      state.firstSubRdo = data.subRdo
    }
    if (data.order === 'second') {
      state.secondSubRdo = data.subRdo
    }
    if (data.order === 'third') {
      state.thirdSubRdo = data.subRdo
    }
  }
}

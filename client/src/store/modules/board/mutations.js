export default {
  SET_BOARD_RDOS (state, payload) {
    state.boardRdos = payload.rdos
  },
  SET_BOARD_FILTERED_RDOS (state, payload) {
    state.boardFilteredRdos = payload.rdos
  },
  SET_RDO (state, payload) {
    state.rdo = payload.rdo
  }
}

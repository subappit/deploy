import { ApiFactory } from 'src/common/api/apiFactory'
import querystring from 'query-string'
const OptionService = ApiFactory.get('option')

export default {
  async getMacroRdo ({ commit }) {
    const { data } = await OptionService.get('/rdo_macrocategory')
    commit('SET_MACRORDO', data.macroRdo)
    return data
  },
  async getCatRdo ({ commit }, { queryparams, order }) {
    const { data } = await OptionService.get('/rdo_category?' + querystring.stringify(queryparams))
    data.order = order
    commit('SET_CATRDO', data)
    return data
  },
  async getSubRdo ({ commit }, { queryparams, order }) {
    const { data } = await OptionService.get('/rdo_subcategory?' + querystring.stringify(queryparams))
    data.order = order
    commit('SET_SUBRDO', data)
    return data
  }

}

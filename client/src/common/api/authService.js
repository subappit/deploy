import ApiService from 'src/common/api/apiService'

const resource = '/auth'

export default {
  login (user) {
    return ApiService.post(resource + '/login', user)
  },
  signup (user) {
    return ApiService.put(resource + '/signup', user)
  },
  forgottenPassword (path) {
    return ApiService.get(resource + path)
  },
  resetPassword (path, body) {
    return ApiService.post(resource + path, body)
  }
}

import Http from '../Http'
import * as action from '../store/actions'

const { log } = console

export default {
  register: function(credentials) {
    return dispatch =>
      new Promise((resolve, reject) => {
        Http.post('/api/auth/register', credentials)
          .then(res => resolve(res.data))
          .catch(err => {
            const statusCode = err.response.status
            const data = {
              error: null,
              statusCode,
            }
            if (statusCode === 422) {
              Object.values(err.response.data.message).map((value, i) => {
                data.error = value
              })
            } else if (statusCode === 400) {
              data.error = err.response.data.message
            }
            return reject(data)
          })
      })
  },
  login: function(credentials) {
    log('login', credentials)
    return dispatch =>
      new Promise((resolve, reject) => {
        Http.post('/api/auth/login', credentials)
          .then(res => dispatch(action.authSet(res.data)))
          .then(async () => await Http.get('/api/auth/user'))
          .then(res => {
            log('login', res)
            dispatch(action.authLogin(res.data))
            return resolve()
          })
          .catch(err => {
            log(err.response)
            const statusCode = err.response.status
            const data = {
              error: null,
              statusCode,
            }
            if (statusCode === 401 || statusCode === 422) {
              data.error = err.response.data.message
            }
            return reject(data)
          })
      })
  },
  resetLink: function(credentials) {
    return dispatch =>
      new Promise((resolve, reject) => {
        Http.post('/api/auth/password/email', credentials)
          .then(res => {
            return resolve(res.data)
          })
          .catch(err => {
            const statusCode = err.response.status
            const data = {
              error: null,
              statusCode,
            }
            if (statusCode === 401 || statusCode === 422) {
              data.error = err.response.data.message
            }
            return reject(data)
          })
      })
  },
  updatePassword: function(credentials) {
    return dispatch =>
      new Promise((resolve, reject) => {
        Http.post('/api/auth/password/reset', credentials)
          .then(res => {
            const statusCode = res.data.status
            if (statusCode == 202) {
              const data = {
                error: res.data.message,
                statusCode,
              }
              return reject(data)
            }
            return resolve(res)
          })
          .catch(err => {
            const statusCode = err.response.status
            const data = {
              error: null,
              statusCode,
            }
            if (statusCode === 401 || statusCode === 422) {
              data.error = err.response.data.message
            }
            return reject(data)
          })
      })
  },
  updateProfile: async function(formData) {
    try {
      const { data, status } = await Http.post('/api/auth/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (status == 202) {
        throw new Error({
          error: data.message,
          statusCode: status,
        })
      }
      return data
    } catch (err) {
      const statusCode = err.response.status
      const data = {
        error: null,
        statusCode,
      }
      if (statusCode === 401 || statusCode === 422) {
        data.error = err.response.data.message
      }
      throw data
    }
  },
}

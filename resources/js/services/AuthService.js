import Http from '../Http'
import actions from '../store/actions'

const { log } = console

export default {
  register: async function(credentials) {
    try {
      const { data } = await Http.post('/api/auth/register', credentials)
      return data
    } catch (err) {
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
      return data
    }
  },
  login: async function(credentials, dispatch) {
    try {
      const loginResult = await Http.post('/api/auth/login', credentials)
      dispatch(actions.AUTH.set(loginResult.data))
      const userResult = await Http.get('/api/auth/user')
      dispatch(actions.AUTH.login(userResult.data))
      return
    } catch (err) {
      const statusCode = err.response.status
      const data = {
        error: null,
        statusCode,
      }
      if (statusCode === 401 || statusCode === 422) {
        data.error = err.response.data.message
      }
      return data
    }
  },
  resetLink: async function(credentials) {
    try {
      const { data } = await Http.post('/api/auth/password/email', credentials)
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
      return data
    }
  },
  updatePassword: async function(credentials) {
    try {
      const result = await Http.post('/api/auth/password/reset', credentials)
      const statusCode = result.data.status
      if (statusCode == 202) {
        const data = {
          error: result.data.message,
          statusCode,
        }
        return result.data
      }
      return result
    } catch (err) {
      const statusCode = err.response.status
      const data = {
        error: null,
        statusCode,
      }
      if (statusCode === 401 || statusCode === 422) {
        data.error = err.response.data.message
      }
      return data
    }
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
      return data
    }
  },
}

import Http from '../Http'
import actions from '../store/actions'

const { log } = console

export default {
  getMaxPages: async (posts_per_page, args) => {
    try {
      const { data } = await Http.get('/api/topics/pages', {
        params: { posts_per_page, ...args },
      })
      return data
    } catch (err) {
      throw err
    }
  },
  getArchive: async (paged, posts_per_page, orderby, args) => {
    try {
      const { data } = await Http.get('/api/topics/archive', {
        params: { posts_per_page, paged, orderby, ...args },
      })
      return data
    } catch (err) {
      throw err
    }
  },
  save: async function(credentials, user_id, dispatch) {
    try {
      const { data } = await Http.post(`/api/topics/${user_id}`, credentials)
      dispatch(actions.TOPIC.save(data))
      return
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
  get: async dispatch => {
    try {
      const { data } = await Http.get('/api/topics')
      dispatch(actions.TOPIC.getAll(data))
    } catch (err) {
      throw err
    }
  },
}

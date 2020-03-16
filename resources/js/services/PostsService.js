import Http from '../Http'
import * as action from '../store/actions'

const { log } = console

export default {
  incrementView: async id => {
    try {
      const { data } = await Http.put(`/api/posts/view/${id}`)
      return data
    } catch (err) {
      throw err
    }
  },
  getPost: async (format, slug) => {
    try {
      const { data } = await Http.get(`/api/posts/${format}/${slug}`)
      return data
    } catch (err) {
      throw err
    }
  },
  getSearch: async (paged, posts_per_page, args) => {
    log(paged, args)
    try {
      const { data } = await Http.get(`/api/posts/search`, {
        params: { paged, posts_per_page, ...args },
      })
      return data
    } catch (err) {
      throw err
    }
  },
  getArchive: async (paged, posts_per_page, orderby, args) => {
    try {
      const { data } = await Http.get(`/api/posts/archive`, {
        params: { paged, posts_per_page, orderby, ...args },
      })
      return data
    } catch (err) {
      throw err
    }
  },
  getHomeList: async (paged, posts_per_page, orderby, auth) => {
    try {
      const { data } = await Http.get(`/api/posts/timeline`, {
        params: { paged, posts_per_page, orderby, user_id: auth.id },
      })
      return data
    } catch (err) {
      throw err
    }
  },
  getUserPosts: async (user_id, format) => {
    try {
      const { data } = await Http.get(`/api/${format}/${user_id}`)
      return data
    } catch (err) {
      throw err
    }
  },
  getUserPost: async (user_id, format, slug) => {
    log('getUserPost', user_id, format, slug)
    try {
      const { data } = await Http.get(`/api/${format}/${user_id}/${slug}`)
      return data
    } catch (err) {
      throw err
    }
  },
  save: async function(formData, user_id, format) {
    log('saving', formData, user_id, format)
    try {
      const { data } = await Http.post(`/api/${format}/${user_id}`, formData)
      log('data', data)
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
      } else if (statusCode === 400 || statusCode === 500) {
        data.error = err.response.data.message
      }
      throw data
    }
  },
  update: async function(formData, user_id, format, id) {
    try {
      const { data } = await Http.put(`/api/${format}/${user_id}/${id}`, formData)
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
      } else if (statusCode === 400 || statusCode === 500) {
        data.error = err.response.data.message
      }
      throw data
    }
  },
  delete: async function(user_id, format, id) {
    try {
      const { data } = await Http.delete(`/api/${format}/${user_id}/${id}`, credentials)
      return data
    } catch (err) {
      throw err
    }
  },
}

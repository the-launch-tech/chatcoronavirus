import Http from '../Http'
import actions from '../store/actions'

const { log } = console

const routeReducer = {
  USER_POST: async args => {
    const { data } = await Http.get(`/api/${args.format}/${args.authId}/${args.slug}`)
    return data
  },
  USER_POSTS: async args => {
    const { data } = await Http.get(`/api/${args.format}/${args.authId}`)
    return data
  },
  SINGLE: async args => {
    const { data } = await Http.get(`/api/posts/${args.format}/${args.slug}`)
    return data
  },
  EXPANSION: async args => {
    const { data } = await Http.get(`/api/posts/expansion/${args.slug}`, {
      params: args,
    })
    return data
  },
  POSTS: async args => {
    const { data } = await Http.get(`/api/posts`, { params: args })
    return data
  },
  ARCHIVE: async args => {
    const { data } = await Http.get(`/api/posts/archive`, { params: args })
    return data
  },
  SEARCH: async args => {
    const { data } = await Http.get(`/api/posts/search`, { params: args })
    return data
  },
  TRENDING: async args => {
    const { data } = await Http.get(`/api/posts/trending`, { params: args })
    return data
  },
  PUBLIC_TIMELINE: async args => {
    const { data } = await Http.get(`/api/posts/timeline/public`, { params: args })
    return data
  },
  PROFILE_TIMELINE: async args => {
    const { data } = await Http.get(`/api/posts/timeline/profile/${args.username}`, {
      params: args,
    })
    return data
  },
}

export default {
  get: async args => {
    try {
      const routeAction = routeReducer[args.route]
      return await routeAction(args)
    } catch (err) {
      throw err
    }
  },
  incrementView: async args => {
    try {
      const { data } = await Http.put(`/api/posts/view/${args.postId}`)
      return data
    } catch (err) {
      throw err
    }
  },
  save: async function(args) {
    try {
      const { data } = await Http.post(`/api/${args.format}/${args.authId}`, args.data)
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
  update: async function(args) {
    try {
      const { data } = await Http.post(
        `/api/update/${args.format}/${args.authId}/${args.postId}`,
        args.data
      )
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
  delete: async function(args) {
    try {
      const { data } = await Http.delete(`/api/${args.format}/${args.authId}/${args.postId}`)
      return data
    } catch (err) {
      throw err
    }
  },
}

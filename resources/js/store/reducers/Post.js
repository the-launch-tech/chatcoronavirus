import * as ActionTypes from '../action-types'
import Http from '../../Http'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log } = console

export default (state = initialState.posts, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.POSTS_TRENDING:
      return postsTrending(state, payload)
    default:
      return state
  }
}

const postsTrending = (state, payload) => {
  return merge(state, {
    trendingPosts: payload.posts,
  })
}

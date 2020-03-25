import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { POST } = TYPES

export default (state = initialState.POST, { type, payload = null }) => {
  switch (type) {
    case POST.TRENDING:
      return getTrending(state, payload)
    case POST.EXPANDED:
      return setExpandedPost(state, payload)
    case POST.SAVED:
      return setSavedPost(state, payload)
    case POST.CURRENT:
      return setCurrentList(state, payload)
    case POST.FRESH:
      return setFresh(state, payload)
    default:
      return state
  }
}

const getTrending = (state, payload) => {
  return merge(state, {
    trendingPosts: payload.posts,
  })
}

const setExpandedPost = (state, payload) => {
  return merge(state, {
    expandedPost: payload,
  })
}

const setSavedPost = (state, payload) => {
  return merge(state, {
    savedPost: payload,
  })
}

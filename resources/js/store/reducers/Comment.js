import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { COMMENT } = TYPES

export default (state = initialState.COMMENT, { type, payload = null }) => {
  switch (type) {
    case COMMENT.RECENT:
      return getRecent(state, payload)
    case COMMENT.EMPTY_CHILDREN:
      return updateEmptyChildren(state, payload)
    default:
      return state
  }
}

const getRecent = (state, payload) => {
  return merge(state, {
    recentComments: payload.comments,
  })
}

const updateEmptyChildren = (state, payload) => {
  return merge(state, {
    emptyCommentChildren: [...state.emptyCommentChildren, payload],
  })
}

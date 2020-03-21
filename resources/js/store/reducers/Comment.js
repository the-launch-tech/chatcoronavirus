import * as ActionTypes from '../action-types'
import Http from '../../Http'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log } = console

export default (state = initialState.comments, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.COMMENTS_RECENT:
      return commentsRecent(state, payload)
    case ActionTypes.COMMENT_EMPTY_CHILDREN:
      return commentEmptyChildren(state, payload)
    default:
      return state
  }
}

const commentsRecent = (state, payload) => {
  return merge(state, {
    recentComments: payload.comments,
  })
}

const commentEmptyChildren = (state, payload) => {
  return merge(state, {
    emptyCommentChildren: [...state.emptyCommentChildren, payload],
  })
}

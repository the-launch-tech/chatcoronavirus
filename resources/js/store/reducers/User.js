import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { USER } = TYPES

export default (state = initialState.USER, { type, payload = null }) => {
  switch (type) {
    case USER.TOP:
      return getTop(state, payload)
    default:
      return state
  }
}

const getTop = (state, payload) => {
  return merge(state, {
    topUsers: payload.users,
  })
}

import * as ActionTypes from '../action-types'
import Http from '../../Http'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log } = console

export default (state = initialState.users, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.USERS_TOP:
      return usersTop(state, payload)
    default:
      return state
  }
}

const usersTop = (state, payload) => {
  return merge(state, {
    topUsers: payload.users,
  })
}

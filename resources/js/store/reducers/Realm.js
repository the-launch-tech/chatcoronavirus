import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { REALM } = TYPES

export default (state = initialState.REALM, { type, payload = null }) => {
  switch (type) {
    case REALM.ALL:
      return getAll(state, payload)
    default:
      return state
  }
}

const getAll = (state, payload) => {
  return Object.assign({}, state, {
    realms: payload.realms,
  })
}

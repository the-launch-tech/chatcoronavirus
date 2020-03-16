import * as ActionTypes from '../action-types'
import Http from '../../Http'

const { log } = console

const initialState = {
  realms: [],
}

export default (state = initialState, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.REALMS_ALL:
      return realmsAll(state, payload)
    default:
      return state
  }
}

const realmsAll = (state, payload) => {
  return Object.assign({}, state, {
    realms: payload.realms,
  })
}

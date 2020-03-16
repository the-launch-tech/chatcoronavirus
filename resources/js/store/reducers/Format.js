import * as ActionTypes from '../action-types'
import Http from '../../Http'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log } = console

export default (state = initialState.formats, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.FORMATS_ALL:
      return formatsAll(state, payload)
    default:
      return state
  }
}

const formatsAll = (state, payload) => {
  return merge(state, {
    formats: payload.formats,
  })
}

import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { FORMAT } = TYPES

export default (state = initialState.FORMAT, { type, payload = null }) => {
  switch (type) {
    case FORMAT.ALL:
      return getAll(state, payload)
    default:
      return state
  }
}

const getAll = (state, payload) => {
  return merge(state, {
    formats: payload.formats,
  })
}

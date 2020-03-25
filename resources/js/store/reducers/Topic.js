import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { TOPIC } = TYPES

export default (state = initialState.TOPIC, { type, payload = null }) => {
  switch (type) {
    case TOPIC.ALL:
      return getAll(state, payload)
    case TOPIC.PRIMARY:
      return getPrimary(state, payload)
    case TOPIC.SAVE:
      return save(state, payload)
    default:
      return state
  }
}

const getAll = (state, payload) => {
  return merge(state, {
    topics: payload.topics,
  })
}

const getPrimary = (state, payload) => {
  return merge(state, {
    primaryTopics: payload.topics,
  })
}

const save = (state, payload) => {
  return merge(state, {
    newTopics: [payload.topic, ...Object.assign([], state.newTopics || [])],
  })
}

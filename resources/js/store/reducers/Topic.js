import * as ActionTypes from '../action-types'
import Http from '../../Http'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log } = console

export default (state = initialState.topics, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.TOPICS_ALL:
      return topicsAll(state, payload)
    case ActionTypes.TOPICS_PRIMARY:
      return topicsPrimary(state, payload)
    case ActionTypes.TOPIC_SAVE:
      return topicSave(state, payload)
    default:
      return state
  }
}

const topicsAll = (state, payload) => {
  return merge(state, {
    topics: payload.topics,
  })
}

const topicsPrimary = (state, payload) => {
  return merge(state, {
    primaryTopics: payload.topics,
  })
}

const topicSave = (state, payload) => {
  return merge(state, {
    newTopics: [payload.topic, ...Object.assign([], state.newTopics || [])],
  })
}

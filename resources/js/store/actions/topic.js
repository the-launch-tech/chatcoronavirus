import TYPES from '../action-types'

const { TOPIC } = TYPES

export function getAll(payload) {
  return {
    type: TOPIC.ALL,
    payload,
  }
}

export function getPrimary(payload) {
  return {
    type: TOPIC.PRIMARY,
    payload,
  }
}

export function save(payload) {
  return {
    type: TOPIC.SAVE,
    payload,
  }
}

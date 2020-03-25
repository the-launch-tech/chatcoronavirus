import TYPES from '../action-types'

const { COMMENT } = TYPES

export function getRecent(payload) {
  return {
    type: COMMENT.RECENT,
    payload,
  }
}

export function updateEmptyChildren(payload) {
  return {
    type: COMMENT.EMPTY_CHILDREN,
    payload,
  }
}

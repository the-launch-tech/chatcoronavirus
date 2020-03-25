import TYPES from '../action-types'

const { USER } = TYPES

export function getTop(payload) {
  return {
    type: USER.TOP,
    payload,
  }
}

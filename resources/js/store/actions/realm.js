import TYPES from '../action-types'

const { REALM } = TYPES

export function getAll(payload) {
  return {
    type: REALM.ALL,
    payload,
  }
}

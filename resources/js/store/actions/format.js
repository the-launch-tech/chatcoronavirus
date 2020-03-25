import TYPES from '../action-types'

const { FORMAT } = TYPES

export function getAll(payload) {
  return {
    type: FORMAT.ALL,
    payload,
  }
}

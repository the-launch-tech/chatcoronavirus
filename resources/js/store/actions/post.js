import TYPES from '../action-types'

const { POST } = TYPES

export function getTrending(payload) {
  return {
    type: POST.TRENDING,
    payload,
  }
}

export function setExpandedPost(payload) {
  return {
    type: POST.EXPANDED,
    payload,
  }
}

export function setSavedPost(payload) {
  return {
    type: POST.SAVED,
    payload,
  }
}

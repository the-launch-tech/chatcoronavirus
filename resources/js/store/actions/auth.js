import TYPES from '../action-types'

const { AUTH } = TYPES

export function set(payload) {
  return {
    type: AUTH.SET,
    payload,
  }
}

export function login(payload) {
  return {
    type: AUTH.LOGIN,
    payload,
  }
}

export function logout() {
  return {
    type: AUTH.LOGOUT,
  }
}

export function check() {
  return {
    type: AUTH.CHECK,
  }
}

export function update(payload) {
  return {
    type: AUTH.UPDATE,
    payload,
  }
}

export function get(payload) {
  return {
    type: AUTH.GET,
    payload,
  }
}

export function setSubscribed(payload) {
  return {
    type: AUTH.SUBSCRIBED,
    payload,
  }
}

export function setPinned(payload) {
  return {
    type: AUTH.PINNED,
    payload,
  }
}

export function setPostCured(payload) {
  return {
    type: AUTH.POST_CURED,
    payload,
  }
}

export function setCommentCured(payload) {
  return {
    type: AUTH.COMMENT_CURED,
    payload,
  }
}

export function setReported(payload) {
  return {
    type: AUTH.REPORTED,
    payload,
  }
}

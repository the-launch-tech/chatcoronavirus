import * as ActionTypes from '../action-types'
import Http from '../../Http'
import initialState from '../utilities/initialState'
import jwtToken from '../utilities/token'
import access from '../utilities/access'
import ttl from '../utilities/ttl'
import merge from '../utilities/merge'
import isExpired from '../utilities/isExpired'
import unsetAuth from '../utilities/unsetAuth'

const { log } = console

export default (state = initialState.auth, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.AUTH_SET:
      return authSet(state, payload)
    case ActionTypes.AUTH_LOGIN:
      return authLogin(state, payload)
    case ActionTypes.AUTH_CHECK:
      return authCheck(state)
    case ActionTypes.AUTH_GET:
      return authGet(state, payload)
    case ActionTypes.AUTH_UPDATE:
      return authUpdate(state, payload)
    case ActionTypes.AUTH_LOGOUT:
      return authLogout(state)
    case ActionTypes.AUTH_SUBSCRIBED:
      return authSetSubscribed(state, payload)
    case ActionTypes.AUTH_PINNED:
      return authSetPinned(state, payload)
    case ActionTypes.AUTH_POST_CURED:
      return authSetPostCured(state, payload)
    case ActionTypes.AUTH_COMMENT_CURED:
      return authSetCommentCured(state, payload)
    default:
      return state
  }
}

function authSet(state, { token }) {
  Http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  jwtToken('set', token)
  ttl('set', new Date())
  return merge(state, {
    isAuthenticated: true,
  })
}

function authLogin(state, { auth }) {
  access('set', auth.access)
  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth,
  })
}

function authCheck(state) {
  if (isExpired()) {
    unsetAuth()
  }
  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth: null,
  })
}

function authGet(state, payload) {
  if (!payload) {
    unsetAuth()
  }

  log('payload', payload)

  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth: payload,
    authSubscribed: payload.subscriptions.map(sub => sub.subscription.subscription_id),
    authPinned: payload.pins.map(sub => sub.pin.post_id),
    authPostCured: payload.post_cures.map(sub => sub.post_cure.post_id),
    authCommentCured: payload.comment_cures.map(sub => sub.comment_cure.comment_id),
  })
}

function authUpdate(state, { auth }) {
  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth,
  })
}

function authLogout(state) {
  unsetAuth()
  window.location.href = 'http://localhost:8000/'
  return merge(state, {
    isAuthenticated: false,
    access: false,
    auth: false,
  })
}

function authSetSubscribed(state, { auth, subscribed, itemId }) {
  return merge(state, {
    authSubscribed: subscribed
      ? [...state.authSubscribed, itemId]
      : state.authSubscribed.filter(item => item !== itemId),
  })
}

function authSetPinned(state, { auth, pinned, itemId }) {
  return merge(state, {
    authPinned: pinned
      ? [...state.authPinned, itemId]
      : state.authPinned.filter(item => item !== itemId),
  })
}

function authSetPostCured(state, { auth, postCured, itemId }) {
  return merge(state, {
    authPostCured: postCured
      ? [...state.authPostCured, itemId]
      : state.authPostCured.filter(item => item !== itemId),
  })
}

function authSetCommentCured(state, { auth, commentCured, itemId }) {
  return merge(state, {
    authCommentCured: commentCured
      ? [...state.authCommentCured, itemId]
      : state.authCommentCured.filter(item => item !== itemId),
  })
}

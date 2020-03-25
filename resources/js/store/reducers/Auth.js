import TYPES from '../action-types'
import Http from '../../Http'
import getUrl from '../../helpers/getUrl'
import initialState from '../utilities/initialState'
import jwtToken from '../utilities/token'
import access from '../utilities/access'
import ttl from '../utilities/ttl'
import merge from '../utilities/merge'
import isExpired from '../utilities/isExpired'
import unsetAuth from '../utilities/unsetAuth'

const { log } = console

const { AUTH } = TYPES

export default (state = initialState.AUTH, { type, payload = null }) => {
  switch (type) {
    case AUTH.SET:
      return set(state, payload)
    case AUTH.LOGIN:
      return login(state, payload)
    case AUTH.CHECK:
      return check(state)
    case AUTH.GET:
      return get(state, payload)
    case AUTH.UPDATE:
      return update(state, payload)
    case AUTH.LOGOUT:
      return logout(state)
    case AUTH.SUBSCRIBED:
      return setSubscribed(state, payload)
    case AUTH.PINNED:
      return setPinned(state, payload)
    case AUTH.POST_CURED:
      return setPostCured(state, payload)
    case AUTH.COMMENT_CURED:
      return setCommentCured(state, payload)
    case AUTH.REPORTED:
      return setReported(state, payload)
    default:
      return state
  }
}

function set(state, { token }) {
  Http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  jwtToken('set', token)
  ttl('set', new Date())
  return merge(state, {
    isAuthenticated: true,
  })
}

function login(state, { auth }) {
  access('set', auth.access)
  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth,
    authSubscribed: auth ? auth.subscriptions.map(sub => sub.subscription.subscription_id) : [],
    authPinned: auth ? auth.pins.map(sub => sub.pin.post_id) : [],
    authPostCured: auth ? auth.post_cures.map(sub => sub.post_cure.post_id) : [],
    authCommentCured: auth ? auth.comment_cures.map(sub => sub.comment_cure.comment_id) : [],
  })
}

function check(state) {
  if (isExpired()) {
    unsetAuth()
  }
  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth: null,
  })
}

function get(state, payload) {
  if (!payload) {
    unsetAuth()
  }

  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth: payload,
    authSubscribed: payload
      ? payload.subscriptions.map(sub => sub.subscription.subscription_id)
      : [],
    authPinned: payload ? payload.pins.map(sub => sub.pin.post_id) : [],
    authPostCured: payload ? payload.post_cures.map(sub => sub.post_cure.post_id) : [],
    authCommentCured: payload ? payload.comment_cures.map(sub => sub.comment_cure.comment_id) : [],
  })
}

function update(state, { auth }) {
  return merge(state, {
    isAuthenticated: !!jwtToken(),
    access: access(),
    auth,
  })
}

function logout(state) {
  unsetAuth()
  window.location.href = getUrl()
  return merge(state, {
    isAuthenticated: false,
    access: false,
    auth: false,
  })
}

function setSubscribed(state, { auth, subscribed, itemId }) {
  return merge(state, {
    authSubscribed: subscribed
      ? [...state.authSubscribed, itemId]
      : state.authSubscribed.filter(item => item !== itemId),
  })
}

function setPinned(state, { auth, pinned, itemId }) {
  return merge(state, {
    authPinned: pinned
      ? [...state.authPinned, itemId]
      : state.authPinned.filter(item => item !== itemId),
  })
}

function setPostCured(state, { auth, postCured, itemId }) {
  return merge(state, {
    authPostCured: postCured
      ? [...state.authPostCured, itemId]
      : state.authPostCured.filter(item => item !== itemId),
  })
}

function setCommentCured(state, { auth, commentCured, itemId }) {
  return merge(state, {
    authCommentCured: commentCured
      ? [...state.authCommentCured, itemId]
      : state.authCommentCured.filter(item => item !== itemId),
  })
}

function setReported(state, { auth, reported, itemId }) {
  return merge(state, {
    authReported: reported
      ? [...state.authReported, itemId]
      : state.authReported.filter(item => item !== itemId),
  })
}

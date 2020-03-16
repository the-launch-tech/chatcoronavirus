import * as ActionTypes from '../action-types'

export function authSet(payload) {
  return {
    type: ActionTypes.AUTH_SET,
    payload,
  }
}

export function authLogin(payload) {
  return {
    type: ActionTypes.AUTH_LOGIN,
    payload,
  }
}

export function authLogout() {
  return {
    type: ActionTypes.AUTH_LOGOUT,
  }
}

export function authCheck() {
  return {
    type: ActionTypes.AUTH_CHECK,
  }
}

export function authUpdate(payload) {
  return {
    type: ActionTypes.AUTH_UPDATE,
    payload,
  }
}

export function authGet(payload) {
  return {
    type: ActionTypes.AUTH_GET,
    payload,
  }
}

export function authSetSubscribed(payload) {
  return {
    type: ActionTypes.AUTH_SUBSCRIBED,
    payload,
  }
}

export function authSetPinned(payload) {
  return {
    type: ActionTypes.AUTH_PINNED,
    payload,
  }
}

export function authSetPostCured(payload) {
  return {
    type: ActionTypes.AUTH_POST_CURED,
    payload,
  }
}

export function authSetCommentCured(payload) {
  return {
    type: ActionTypes.AUTH_COMMENT_CURED,
    payload,
  }
}

export function topicsAll(payload) {
  return {
    type: ActionTypes.TOPICS_ALL,
    payload,
  }
}

export function topicsPrimary(payload) {
  return {
    type: ActionTypes.TOPICS_PRIMARY,
    payload,
  }
}

export function topicSave(payload) {
  return {
    type: ActionTypes.TOPIC_SAVE,
    payload,
  }
}

export function realmsAll(payload) {
  return {
    type: ActionTypes.REALMS_ALL,
    payload,
  }
}

export function formatsAll(payload) {
  return {
    type: ActionTypes.FORMATS_ALL,
    payload,
  }
}

export function auxGoogle(payload) {
  return {
    type: ActionTypes.AUX_GOOGLE,
    payload,
  }
}

export function auxUpdateSubscriptionStore(payload) {
  return {
    type: ActionTypes.AUX_SUBSCRIPTION_STORE,
    payload,
  }
}

export function auxUpdatePinStore(payload) {
  return {
    type: ActionTypes.AUX_PIN_STORE,
    payload,
  }
}

export function auxUpdatePostCureStore(payload) {
  return {
    type: ActionTypes.AUX_POST_CURE_STORE,
    payload,
  }
}

export function auxUpdateCommentCureStore(payload) {
  return {
    type: ActionTypes.AUX_COMMENT_CURE_STORE,
    payload,
  }
}

export function auxLoading(payload) {
  return {
    type: ActionTypes.AUX_LOADING,
    payload,
  }
}

export function auxTheme(payload) {
  return {
    type: ActionTypes.AUX_THEME,
    payload,
  }
}

export function commentsRecent(payload) {
  return {
    type: ActionTypes.COMMENTS_RECENT,
    payload,
  }
}

export function postsTrending(payload) {
  return {
    type: ActionTypes.POSTS_TRENDING,
    payload,
  }
}

export function usersTop(payload) {
  return {
    type: ActionTypes.USERS_TOP,
    payload,
  }
}

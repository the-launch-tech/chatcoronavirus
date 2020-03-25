import TYPES from '../action-types'

const { AUX } = TYPES

export function getGoogle(payload) {
  return {
    type: AUX.GOOGLE,
    payload,
  }
}

export function updateSubscriptionStore(payload) {
  return {
    type: AUX.SUBSCRIPTION_STORE,
    payload,
  }
}

export function updatePinStore(payload) {
  return {
    type: AUX.PIN_STORE,
    payload,
  }
}

export function updatePostCureStore(payload) {
  return {
    type: AUX.POST_CURE_STORE,
    payload,
  }
}

export function updateCommentCureStore(payload) {
  return {
    type: AUX.COMMENT_CURE_STORE,
    payload,
  }
}

export function toggleTheme(payload) {
  return {
    type: AUX.THEME,
    payload,
  }
}

export function toggleSimpleDialog(payload) {
  return {
    type: AUX.SIMPLE_DIALOG,
    payload,
  }
}

export function updateScreen(payload) {
  return {
    type: AUX.SCREEN,
    payload,
  }
}

export function toggleLoading(payload) {
  return {
    type: AUX.LOADING,
    payload,
  }
}

export function updateTimelineContent(payload) {
  return {
    type: AUX.TIMELINE_CONTENT,
    payload,
  }
}

export function updatePageTitle(payload) {
  return {
    type: AUX.PAGE_TITLE,
    payload,
  }
}

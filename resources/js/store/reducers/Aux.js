import TYPES from '../action-types'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log, error } = console

const { AUX } = TYPES

export default (state = initialState.AUX, { type, payload = null }) => {
  switch (type) {
    case AUX.GOOGLE:
      return getGoogle(state, payload)
    case AUX.SUBSCRIPTION_STORE:
      return updateSubscriptionStore(state, payload)
    case AUX.PIN_STORE:
      return updatePinStore(state, payload)
    case AUX.POST_CURE_STORE:
      return updatePostCureStore(state, payload)
    case AUX.COMMENT_CURE_STORE:
      return updateCommentCureStore(state, payload)
    case AUX.THEME:
      return toggleTheme(state, payload)
    case AUX.SIMPLE_DIALOG:
      return toggleSimpleDialog(state, payload)
    case AUX.SCREEN:
      return updateScreen(state, payload)
    case AUX.LOADING:
      return toggleLoading(state, payload)
    case AUX.TIMELINE_CONTENT:
      return updateTimelineContent(state, payload)
    case AUX.PAGE_TITLE:
      return updatePageTitle(state, payload)
    default:
      return state
  }
}

const getGoogle = (state, payload) => {
  return merge(state, {
    googleUpdates: payload.aux,
  })
}

const updateSubscriptionStore = (state, { initial, itemId, newCount }) => {
  const subscriptionStore = Object.assign({}, state.subscriptionStore)
  subscriptionStore[itemId] = initial ? initial : newCount
  return merge(state, {
    subscriptionStore,
  })
}

const updatePinStore = (state, { initial, itemId, newCount }) => {
  const pinStore = Object.assign({}, state.pinStore)
  pinStore[itemId] = initial ? initial : newCount
  return merge(state, {
    pinStore,
  })
}

const updatePostCureStore = (state, { initial, itemId, newCount }) => {
  const postCureStore = Object.assign({}, state.postCureStore)
  postCureStore[itemId] = initial ? initial : newCount
  return merge(state, {
    postCureStore,
  })
}

const updateCommentCureStore = (state, { initial, itemId, newCount }) => {
  const commentCureStore = Object.assign({}, state.commentCureStore)
  commentCureStore[itemId] = initial ? initial : newCount
  return merge(state, {
    commentCureStore,
  })
}

const toggleTheme = (state, theme) => {
  localStorage.setItem('cc_theme', theme)
  document.querySelector('body').classList.remove(theme === 'daytime' ? 'nighttime' : 'daytime')
  document.querySelector('body').classList.add(theme)
  return merge(state, {
    theme,
  })
}

const toggleSimpleDialog = (state, payload) => {
  return merge(state, {
    simpleDialogArgs: payload,
  })
}

const updateScreen = (state, payload) => {
  localStorage.setItem('cc_screen', payload)
  return merge(state, {
    screen: payload,
  })
}

const toggleLoading = (state, payload) => {
  return merge(state, {
    loading: payload,
  })
}

const updateTimelineContent = (state, payload) => {
  localStorage.setItem('cc_timelineContent', payload)
  return merge(state, {
    timelineContent: payload,
  })
}

const updatePageTitle = (state, payload) => {
  return merge(state, {
    pageTitle: {
      current: payload.pageTitle,
      showCurrent: payload.showCurrent,
    },
  })
}

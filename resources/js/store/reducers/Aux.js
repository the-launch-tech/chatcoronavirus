import * as ActionTypes from '../action-types'
import Http from '../../Http'
import merge from '../utilities/merge'
import initialState from '../utilities/initialState'

const { log } = console

export default (state = initialState.aux, { type, payload = null }) => {
  switch (type) {
    case ActionTypes.AUX_GOOGLE:
      return auxGoogle(state, payload)
    case ActionTypes.AUX_LOADING:
      return auxLoading(state, payload)
    case ActionTypes.AUX_SUBSCRIPTION_STORE:
      return auxUpdateSubscriptionStore(state, payload)
    case ActionTypes.AUX_PIN_STORE:
      return auxUpdatePinStore(state, payload)
    case ActionTypes.AUX_POST_CURE_STORE:
      return auxUpdatePostCureStore(state, payload)
    case ActionTypes.AUX_COMMENT_CURE_STORE:
      return auxUpdateCommentCureStore(state, payload)
    case ActionTypes.AUX_THEME:
      return auxTheme(state, payload)
    case ActionTypes.AUX_SIMPLE_DIALOG:
      return auxSimpleDialog(state, payload)
    default:
      return state
  }
}

const auxGoogle = (state, payload) => {
  return merge(state, {
    googleUpdates: payload.aux,
  })
}

const auxLoading = (state, payload) => {
  return merge(state, {
    loading: payload,
  })
}

const auxUpdateSubscriptionStore = (state, { initial, itemId, newCount }) => {
  const subscriptionStore = Object.assign({}, state.subscriptionStore)
  subscriptionStore[itemId] = initial ? initial : newCount
  return merge(state, {
    subscriptionStore,
  })
}

const auxUpdatePinStore = (state, { initial, itemId, newCount }) => {
  const pinStore = Object.assign({}, state.pinStore)
  pinStore[itemId] = initial ? initial : newCount
  return merge(state, {
    pinStore,
  })
}

const auxUpdatePostCureStore = (state, { initial, itemId, newCount }) => {
  const postCureStore = Object.assign({}, state.postCureStore)
  postCureStore[itemId] = initial ? initial : newCount
  return merge(state, {
    postCureStore,
  })
}

const auxUpdateCommentCureStore = (state, { initial, itemId, newCount }) => {
  const commentCureStore = Object.assign({}, state.commentCureStore)
  commentCureStore[itemId] = initial ? initial : newCount
  return merge(state, {
    commentCureStore,
  })
}

const auxTheme = (state, theme) => {
  localStorage.setItem('theme', theme)
  document.querySelector('body').classList.remove(theme === 'daytime' ? 'nighttime' : 'daytime')
  document.querySelector('body').classList.add(theme)
  return merge(state, {
    theme,
  })
}

const auxSimpleDialog = (state, payload) => {
  return merge(state, {
    simpleDialogArgs: payload,
  })
}

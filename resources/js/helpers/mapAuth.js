export default ({ Auth, Aux }) => {
  return {
    isAuthenticated: Auth.isAuthenticated,
    auth: Auth.auth,
    access: Auth.access,
    loading: Aux.loading,
    authSubscribed: Auth.authSubscribed,
    subscriptionStore: Aux.subscriptionStore,
    authPinned: Auth.authPinned,
    pinStore: Aux.pinStore,
    authPostCured: Auth.authPostCured,
    postCureStore: Aux.postCureStore,
    authCommentCured: Auth.authCommentCured,
    commentCureStore: Aux.commentCureStore,
    dialog: Aux.dialog,
    screen: Aux.screen,
  }
}

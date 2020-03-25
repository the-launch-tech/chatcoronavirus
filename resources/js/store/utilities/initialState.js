export default {
  AUTH: {
    isAuthenticated: false,
    access: false,
    auth: {
      id: null,
      name: null,
      email: null,
      avatar: null,
      country: null,
      state: null,
      heath_points: null,
      malpractices: null,
      createdAt: null,
      updatedAt: null,
    },
    authSubscribed: [],
    authPinned: [],
    authPostCured: [],
    authCommentCured: [],
    authReported: [],
  },
  TOPIC: {
    topics: [],
    newTopics: [],
    primaryTopics: [],
  },
  REALM: {
    realms: [],
  },
  FORMAT: {
    formats: [],
  },
  AUX: {
    googleUpdates: [],
    loading: true,
    subscriptionStore: {},
    pinStore: {},
    postCureStore: {},
    commentCureStore: {},
    simpleDialogArgs: { active: false, content: '' },
    theme: localStorage.getItem('cc_theme') ? localStorage.getItem('cc_theme') : 'nighttime',
    screen: localStorage.getItem('cc_screen') ? localStorage.getItem('cc_screen') : 'desktop',
    timelineContent: localStorage.getItem('cc_timelineContent')
      ? localStorage.getItem('cc_timelineContent')
      : 'public',
    pageTitle: {
      current: null,
      showCurrent: null,
    },
  },
  POST: {
    trendingPosts: [],
    expandedPost: false,
    savedPost: false,
    currentList: [],
    fresh: false,
  },
  COMMENT: {
    recentComments: [],
    emptyCommentChildren: [],
  },
  USER: {
    topUsers: [],
  },
}

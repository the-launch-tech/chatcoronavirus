export default {
  auth: {
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
  },
  topics: {
    topics: [],
    newTopics: [],
    primaryTopics: [],
  },
  formats: {
    formats: [],
  },
  aux: {
    googleUpdates: [],
    loading: true,
    subscriptionStore: {},
    pinStore: {},
    postCureStore: {},
    commentCureStore: {},
    theme: 'nighttime',
  },
  posts: {
    recentPosts: [],
  },
  comments: {
    recentComments: [],
  },
  users: {
    topUsers: [],
  },
}

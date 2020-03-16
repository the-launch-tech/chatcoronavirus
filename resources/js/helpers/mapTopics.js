export default ({ Auth, Topic }) => {
  return {
    isAuthenticated: Auth.isAuthenticated,
    auth: Auth.auth,
    access: Auth.access,
    topics: Topic.topics,
    newTopics: Topic.newTopics,
  }
}

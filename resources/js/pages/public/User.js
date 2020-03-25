import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import ChatForm from '../../common/forms/ChatForm'
import PostList from '../../common/posts/PostList'
import PostsService from '../../services/PostsService'
import actions from '../../store/actions'
import UserHeader from '../../common/UserHeader'
import AuthService from '../../services/AuthService'

const { log, error } = console

export default connect(({ Auth, Aux, Post }) => {
  return {
    auth: Auth.auth,
    loading: Aux.loading,
    savedPost: Post.savedPost,
  }
})(User)

function User({ dispatch, auth, page, match, loading, savedPost }) {
  const [user, setUser] = useState({})
  const [fresh, setFresh] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [paged, setPaged] = useState(0)
  const [posts, setPosts] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    getUser()
    getProfileTimeline()
    dispatch(
      actions.AUX.updatePageTitle({
        pageTitle: `${match.params.username}'s Timeline`,
        showCurrent: true,
      })
    )
  }, [])

  useEffect(() => {
    getUser()
    setFresh(true)
    dispatch(
      actions.AUX.updatePageTitle({
        pageTitle: `${match.params.username}'s Timeline`,
        showCurrent: true,
      })
    )
  }, [match.params.username])

  useEffect(() => {
    if (loading && fresh) {
      getProfileTimeline()
    }
  }, [loading])

  useEffect(() => {
    setEmpty(paged >= maxPages)
  }, [paged, maxPages])

  useEffect(() => {
    if (fresh) {
      if (loading) {
        getProfileTimeline()
      } else {
        loader(dispatch, true)
      }
    }
  }, [fresh])

  useEffect(() => {
    if (savedPost) {
      setPosts([savedPost, ...posts])
      dispatch(actions.POST.setSavedPost(false))
    }
  }, [savedPost])

  function loadMore(event) {
    event.preventDefault()
    if (!empty) {
      loader(dispatch, true)
      getProfileTimeline()
    }
  }

  function getProfileTimeline() {
    PostsService.get({
      route: 'PROFILE_TIMELINE',
      paged: fresh ? 0 : paged,
      posts_per_page: 5,
      username: match.params.username,
    })
      .then(data => {
        if (fresh) {
          setPaged(1)
          setPosts(data.posts)
          setMaxPages(data.total)
        } else {
          setPaged(paged + 1)
          setPosts([...posts, ...data.posts])
          setMaxPages(data.total)
        }
        setFresh(false)
        loader(dispatch, false)
      })
      .catch(err => {
        setFresh(false)
        loader(dispatch, false)
        setEmpty(true)
        error(err)
      })
  }

  function getUser() {
    AuthService.getUser({ username: match.params.username })
      .then(data => {
        setUser(data.user)
      })
      .catch(err => {
        error(err)
      })
  }

  return (
    <React.Fragment>
      <UserHeader user={user} />
      {auth && auth.username === match.params.username && <ChatForm />}
      <PostList posts={posts} loadMore={loadMore} empty={empty} />
    </React.Fragment>
  )
}

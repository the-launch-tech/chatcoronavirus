import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import PostList from '../../common/posts/PostList'
import PostsService from '../../services/PostsService'
import actions from '../../store/actions'
import VisitorContent from './home/VisitorContent'
import TimelineForm from './home/TimelineForm'
import ChatForm from '../../common/forms/ChatForm'

const { log, error } = console

export default connect(({ Auth, Aux, Post }) => {
  return {
    auth: Auth.auth,
    isAuthenticated: Auth.isAuthenticated,
    loading: Aux.loading,
    timelineContent: Aux.timelineContent,
    savedPost: Post.savedPost,
  }
})(Home)

function Home({ isAuthenticated, auth, dispatch, page, loading, timelineContent, savedPost }) {
  const [fresh, setFresh] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [paged, setPaged] = useState(0)
  const [posts, setPosts] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    dispatch(actions.AUX.updatePageTitle({ pageTitle: `ChatCoronavirus`, showCurrent: true }))

    return () => {
      resetState(false)
    }
  }, [])

  useEffect(() => {
    if (loading) {
      getHomeList({
        params: {
          route: 'PUBLIC_TIMELINE',
          paged,
          posts_per_page: 10,
          orderby: 'created_at',
          authId: auth ? auth.id : 0,
          timeline_content: timelineContent,
        },
        callback: data => {
          if (fresh) {
            setMaxPages(data.total)
            setPaged(1)
            setPosts(data.posts)
          } else {
            setMaxPages(data.total)
            setPaged(paged + 1)
            setPosts([...posts, ...data.posts])
          }
          setFresh(false)
          loader(dispatch, false)
        },
      })
    }
  }, [loading])

  useEffect(() => {
    if (fresh) {
      loader(dispatch, true)
    }
  }, [fresh])

  useEffect(() => {
    if (auth) {
      getHomeList({
        params: {
          route: 'PUBLIC_TIMELINE',
          paged: 0,
          posts_per_page: 10,
          orderby: 'created_at',
          authId: auth.id,
          timeline_content: timelineContent,
        },
        callback: data => {
          setMaxPages(data.total)
          setPaged(1)
          setPosts(data.posts)
          setFresh(false)
          loader(dispatch, false)
        },
      })
    }
  }, [auth])

  useEffect(() => {
    setEmpty(paged >= maxPages)
  }, [paged, maxPages])

  useEffect(() => {
    resetState(true)
  }, [timelineContent])

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
    }
  }

  function getHomeList(args) {
    PostsService.get(args.params)
      .then(args.callback)
      .catch(err => {
        loader(dispatch, false)
        setFresh(false)
        setEmpty(true)
        error(err)
      })
  }

  function resetState(freshState) {
    setEmpty(false)
    setPaged(0)
    setMaxPages(-1)
    setPosts([])
    setFresh(freshState)
  }

  return (
    <React.Fragment>
      <TimelineForm />
      <ChatForm />
      <PostList posts={posts} loadMore={loadMore} empty={empty} />
    </React.Fragment>
  )
}

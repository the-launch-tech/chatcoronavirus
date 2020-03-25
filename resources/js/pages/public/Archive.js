import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import PostList from '../../common/posts/PostList'
import PostsService from '../../services/PostsService'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import actions from '../../store/actions'

const { log, error } = console

export default withRouter(connect(mapAuth)(Archive))

function Archive({ title, page, dispatch, type, slug, match, auth, isAuthenticated, loading }) {
  const [fresh, setFresh] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [paged, setPaged] = useState(0)
  const [posts, setPosts] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  slug = match.params.slug ? match.params.slug : slug

  useEffect(() => {
    dispatch(
      actions.AUX.updatePageTitle({ pageTitle: `${toTitleCase(slug)} Archive`, showCurrent: true })
    )
  }, [])

  useEffect(() => {
    setFresh(true)
    setPaged(0)
  }, [match.params, match.params.slug, match.params.format])

  useEffect(() => {
    if (fresh) {
      getArchive()
    }
  }, [fresh])

  useEffect(() => {
    setEmpty(paged >= maxPages)
  }, [paged, maxPages])

  useEffect(() => {
    if (loading) {
      getArchive()
    }
  }, [loading])

  function loadMore() {
    if (!empty) {
      loader(dispatch, true)
    }
  }

  function getArchive() {
    PostsService.get({
      route: 'ARCHIVE',
      paged: fresh ? 0 : paged,
      posts_per_page: 5,
      orderby: 'created_at',
      type,
      slug,
    })
      .then(data => {
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
      })
      .catch(err => {
        setFresh(false)
        loader(dispatch, false)
        setEmpty(true)
        error(err)
      })
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  return (
    <React.Fragment>
      <PostList posts={posts} loadMore={loadMore} empty={empty} />
    </React.Fragment>
  )
}

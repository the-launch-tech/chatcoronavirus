import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import PostExcerpt from '../../common/excerpts/PostExcerpt'
import PostService from '../../services/PostsService'
import * as action from '../../store/actions'

const { log, error } = console

export default connect(mapAuth)(Home)

function Home({ isAuthenticated, auth, dispatch, page, loading }) {
  const [fresh, setFresh] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [paged, setPaged] = useState(0)
  const [posts, setPosts] = useState([])
  const [maxPages, setMaxPages] = useState(-1)

  useEffect(() => {
    if (auth && isAuthenticated) {
      getHomeList()
    } else {
      loader(dispatch, false)
    }
  }, [])

  useEffect(() => {
    if (auth && isAuthenticated) {
      getHomeList()
    }
  }, [auth])

  useEffect(() => setEmpty(paged >= maxPages), [paged, maxPages])

  useEffect(() => {
    if (loading && auth && isAuthenticated) {
      getHomeList()
    }
  }, [loading])

  function loadMore() {
    if (!empty) {
      loader(dispatch, true)
    }
  }

  function getHomeList() {
    PostService.getHomeList(paged, 10, 'created_at', auth)
      .then(data => {
        setMaxPages(data.total)
        setPaged(paged + 1)
        setPosts([...posts, ...data.posts])
        loader(dispatch, false)
      })
      .catch(err => {
        loader(dispatch, false)
        error(err)
      })
  }

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <h3 className="home-title">Chat Coronavirus</h3>
        {!isAuthenticated ? (
          <div className="home-intro">
            <ul className="home-features">
              <li className="home-feature">
                <h6 className="home-feature-title">Write Articles</h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">Create Threads</h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">Archive Resources</h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">
                  Talk With Others in Threads and Comment Sections
                </h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">Repost Your Favorite Posts</h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">Curate Your Personal Timeline</h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">
                  Gain "Health Points" And Become a Reputable User
                </h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">
                  Subscribe and Follow Other Users and Conversations to Stay Informed
                </h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">Help The Community Grow!</h6>
              </li>
              <li className="home-feature">
                <h6 className="home-feature-title">Spread Useful Information and Experiences...</h6>
              </li>
            </ul>
            <div className="home-links">
              <Link className="home-link md-btn green-btn" to="/register">
                Register <i className="fal fa-sign-in"></i>
              </Link>
              <Link className="home-link md-btn green-btn" to="/login">
                Login <i className="fal fa-user"></i>
              </Link>
            </div>
            <div className="home-info">
              <p className="home-info-text">
                <i>
                  <sup>*</sup> If you are mildly sick <strong>stay home</strong>. If you are
                  severely sick call your local health officials <strong>from home</strong> in order
                  to plan your social interactions.
                </i>
              </p>
            </div>
          </div>
        ) : (
          <div className="home-content">
            {auth ? <h6 className="home-timeline">Public Timeline For {auth.username}</h6> : ''}
            <div className="home-timeline-list">
              {posts.map((post, i) => (
                <PostExcerpt key={i} post={post} />
              ))}
            </div>
            {!loading && !empty && (
              <button className="load-more-button green-btn md-btn" onClick={loadMore}>
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

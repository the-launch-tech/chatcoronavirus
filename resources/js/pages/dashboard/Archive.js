import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import PostsService from '../../services/PostsService'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default withRouter(connect(mapAuth)(Archive))

function Archive({ auth, dispatch, match }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    PostsService.getUserPosts(auth.id, match.params.format)
      .then(data => {
        setPosts(data.posts)
      })
      .catch(err => {
        error(err)
      })
  }, [match.params.format])

  return (
    <div className="archive-wrapper">
      <h5>Your {match.params.format}</h5>
      {posts ? (
        <div className="archive-content">
          {posts.map((item, i) => (
            <div className={`archive-item ${match.params.format}`} key={i}>
              <div>
                <div className="archive-item-meta">
                  <span className="archive-item-cures">
                    <i className="fal fa-capsules"></i> {iconCount(item.cures)}
                  </span>
                  <span className="archive-item-views">
                    <i className="fal fa-eye"></i> {iconCount(item.views)}
                  </span>
                </div>
                <Link
                  className="archive-item-anchor"
                  to={`/dashboard/${auth.id}/${match.params.format}/${item.slug}`}
                >
                  <h6 className="archive-item-title">{item.title}</h6>
                </Link>
                <span className="archive-item-created">
                  {moment(item.created_at).format('LLL')}
                </span>
                <div
                  className="archive-item-excerpt"
                  dangerouslySetInnerHTML={{ __html: item.excerpt }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="archive-content">
          <p className="articles-not-found">You haven't posted any articles yet!</p>
        </div>
      )}
    </div>
  )
}

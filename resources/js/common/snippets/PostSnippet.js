import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import loader from '../../helpers/loader'
import ButtonCure from '../utils/ButtonCure'
import mapAuth from '../../helpers/mapAuth'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(PostSnippet)

function PostSnippet({ isAuthenticated, auth, post, dispatch }) {
  return (
    <div className="snippet post-snippet">
      <div className="snippet-meta post-snippet">
        <ButtonCure
          classNames={['snippet-icon', 'post-snippet', 'snippet-icon-hover']}
          itemId={post.id}
          currentCures={post.cures_count}
          type="post"
        />
        <span className="snippet-icon post-snippet">
          <i className="fal fa-comment"></i> {iconCount(post.comments_count)}
        </span>
      </div>
      <div className="snippet-main-wrapper">
        <Link
          className="snippet-title-anchor post-snippet"
          to={`/${post.format.slug}s/${post.slug}`}
          onClick={() => loader(dispatch, true)}
        >
          <h6 className="snippet-title post-snippet">{post.title}</h6>
        </Link>
        {post.users ? (
          <React.Fragment>
            {post.users.map((user, i) => (
              <Link
                key={i}
                className="snippet-subtitle-anchor post-snippet"
                to={`/profile/${user.username}`}
                onClick={() => loader(dispatch, true)}
              >
                <img
                  className="snippet-avatar post-snippet"
                  src={`/storage/${user.avatar}`}
                  alt={user.username}
                  title={user.username}
                />
                <span className="snippet-subtitle post-snippet">{user.username}</span>
              </Link>
            ))}
          </React.Fragment>
        ) : (
          ''
        )}
        <div className="snippet-details post-snippet">
          <Link
            className="snippet-detail-anchor post-snippet"
            to={`/${post.format.slug}s`}
            onClick={() => loader(dispatch, true)}
          >
            <span className="snippet-detail post-snippet">{post.format.label}</span>
          </Link>
        </div>
        <div
          className="snippet-content post-snippet"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        ></div>
      </div>
    </div>
  )
}

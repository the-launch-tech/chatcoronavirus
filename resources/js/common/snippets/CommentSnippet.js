import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import loader from '../../helpers/loader'
import ButtonCure from '../utils/ButtonCure'
import mapAuth from '../../helpers/mapAuth'

const { log, error } = console

export default connect(mapAuth)(CommentSnippet)

function CommentSnippet({ isAuthenticated, auth, comment, dispatch }) {
  return (
    <div className="snippet comment-snippet">
      <div className="snippet-meta comment-snippet">
        <ButtonCure
          classNames={['snippet-icon', 'comment-snippet', 'snippet-icon-hover']}
          itemId={comment.id}
          currentCures={comment.cures_count}
          type="comment"
        />
      </div>
      <div className="snippet-main-wrapper">
        {comment.post && (
          <Link
            className="snippet-title-anchor comment-snippet"
            to={`/${comment.post.format.slug}s/${comment.post.slug}`}
            onClick={() => loader(dispatch, true)}
          >
            <h6 className="snippet-title comment-snippet">{comment.post.title}</h6>
          </Link>
        )}
        {comment.user && (
          <Link
            className="snippet-subtitle-anchor comment-snippet"
            to={`/profile/${comment.user.username}`}
            onClick={() => loader(dispatch, true)}
          >
            <img
              className="snippet-avatar comment-snippet"
              src={`/storage/${comment.user.avatar}`}
              alt={comment.user.username}
              title={comment.user.username}
            />
            <span className="snippet-subtitle comment-snippet">{comment.user.username}</span>
          </Link>
        )}
        <div
          className="snippet-content comment-snippet"
          dangerouslySetInnerHTML={{
            __html:
              comment.content.length > 150
                ? comment.content.substr(0, 150) + '...'
                : comment.content,
          }}
        ></div>
      </div>
    </div>
  )
}

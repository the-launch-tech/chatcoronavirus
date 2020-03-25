import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import getUrl from '../../../helpers/getUrl'
import loader from '../../../helpers/loader'

export default connect()(ExcerptCommentsPreview)

function ExcerptCommentsPreview({ post, dispatch }) {
  return (
    <div className="excerpt-comments">
      <h6 className="excerpt-comments-title">Conversation Preview</h6>
      {post.comments && post.comments.length ? (
        <div className="excerpt-comments-list">
          {post.comments.map((comment, i) => (
            <div key={i} className="excerpt-comment">
              <Link
                className="excerpt-comment-user"
                to={`/profile/${comment.user.username}`}
                onClick={() => loader(dispatch, true)}
              >
                {comment.user && comment.user.avatar ? (
                  <img
                    id="excerpt-comment-user-avatar"
                    className="excerpt-comment-user-avatar"
                    src={getUrl('/storage/' + comment.user.avatar)}
                    alt={comment.user.username}
                    title={comment.user.username}
                  />
                ) : (
                  ''
                )}

                <h6 className="excerpt-comment-user-username">{comment.user.username}</h6>
              </Link>
              <div
                key={i}
                className="excerpt-comment-content"
                dangerouslySetInnerHTML={{
                  __html:
                    comment.content.length > 100
                      ? comment.content.substr(0, 100) + '...'
                      : comment.content,
                }}
              ></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="excerpt-no">Be The First To Comment</div>
      )}
    </div>
  )
}

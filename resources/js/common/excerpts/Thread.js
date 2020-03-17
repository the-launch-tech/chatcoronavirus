import React from 'react'
import { connect } from 'react-redux'
import ExcerptHeader from './ExcerptHeader'
import ExcerptFooter from './ExcerptFooter'
import { Link } from 'react-router-dom'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import getUrl from '../../helpers/getUrl'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(ThreadExcerpt)

function ThreadExcerpt({ post, isAuthenticated, auth, dispatch }) {
  return (
    <article id={`thread-excerpt-${post.id}`} className="thread-excerpt">
      {post.users.map((user, i) => (
        <ExcerptHeader key={i} post={post} user={user} />
      ))}
      <div className="thread-excerpt-body">
        <div className="thread-excerpt-body-main">
          <Link
            className="excerpt-title-anchor"
            to={`/${post.format.slug}s/${post.slug}`}
            onClick={() => loader(dispatch, true)}
          >
            <h5 className="thread-excerpt-title">{post.title}</h5>
          </Link>
          {post.excerpt ? (
            <div
              className="thread-excerpt-rich-excerpt"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            ></div>
          ) : (
            ''
          )}
          <div className="thread-excerpt-comments">
            <h6 className="thread-excerpt-comments-title">Conversation Preview</h6>
            {post.comments && post.comments.length ? (
              <div className="thread-excerpt-comments-list">
                {post.comments.map((comment, i) => (
                  <div key={i} className="thread-excerpt-comment">
                    <Link
                      className="thread-excerpt-comment-user"
                      to={`/profile/${comment.user.username}`}
                      onClick={() => loader(dispatch, true)}
                    >
                      {comment.user && comment.user.avatar ? (
                        <img
                          id="thread-excerpt-comment-user-avatar"
                          className="thread-excerpt-comment-user-avatar"
                          src={getUrl('/storage/' + comment.user.avatar)}
                          alt={comment.user.username}
                          title={comment.user.username}
                        />
                      ) : (
                        ''
                      )}

                      <h6 className="thread-excerpt-comment-user-username">
                        {comment.user.username}
                      </h6>
                    </Link>
                    <div
                      key={i}
                      className="thread-excerpt-comment-content"
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
              <div className="thread-excerpt-no">Be The First To Comment</div>
            )}
          </div>
        </div>
      </div>
      <ExcerptFooter post={post} format="Thread" />
    </article>
  )
}

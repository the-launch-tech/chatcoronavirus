import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import loader from '../../../helpers/loader'

export default connect()(ExcerptBody)

function ExcerptBody({ post, dispatch }) {
  return (
    <div className="excerpt-body-main">
      <Link
        className="excerpt-title-anchor"
        to={`/${post.format.slug}s/${post.slug}`}
        onClick={() => loader(dispatch, true)}
      >
        <h5 className="excerpt-title">{post.title}</h5>
      </Link>
      {post.excerpt ? (
        <div
          className="excerpt-rich-excerpt"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        ></div>
      ) : (
        ''
      )}
    </div>
  )
}

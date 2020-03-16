import React from 'react'
import { connect } from 'react-redux'
import ExcerptHeader from './ExcerptHeader'
import ExcerptFooter from './ExcerptFooter'
import { Link } from 'react-router-dom'
import mapAuth from '../../helpers/mapAuth'
import loader from '../../helpers/loader'
import iconCount from '../../helpers/iconCount'

const { log, error } = console

export default connect(mapAuth)(ResourceExcerpt)

function ResourceExcerpt({ post, isAuthenticated, auth, dispatch }) {
  return (
    <article id={`resource-excerpt-${post.id}`} className="resource-excerpt">
      {post.users.map((user, i) => (
        <ExcerptHeader key={i} post={post} user={user} />
      ))}
      <div className="resource-excerpt-body">
        <div className="resource-excerpt-body-main">
          <Link
            className="excerpt-title-anchor"
            to={`/${post.format.slug}s/${post.slug}`}
            onClick={() => loader(dispatch, true)}
          >
            <h5 className="resource-excerpt-title">{post.title}</h5>
          </Link>
          {post.excerpt ? (
            <div
              className="resource-excerpt-rich-excerpt"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            ></div>
          ) : (
            ''
          )}
        </div>
      </div>
      <ExcerptFooter post={post} format="Resource" />
    </article>
  )
}

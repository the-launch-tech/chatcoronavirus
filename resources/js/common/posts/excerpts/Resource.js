import React from 'react'
import ExcerptHeader from '../utils/ExcerptHeader'
import ExcerptFooter from '../utils/ExcerptFooter'
import ExcerptBody from '../utils/ExcerptBody'

const { log, error } = console

export default ResourceExcerpt

function ResourceExcerpt({ post, expandable, expandPost }) {
  return (
    <article id={`resource-excerpt-${post.id}`} className="excerpt resource-excerpt">
      <ExcerptHeader post={post} user={post.user} />
      <div className="excerpt-body">
        <ExcerptBody post={post} />
      </div>
      <ExcerptFooter post={post} format="Resource" />
    </article>
  )
}

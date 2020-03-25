import React from 'react'
import ExcerptHeader from '../utils/ExcerptHeader'
import ExcerptFooter from '../utils/ExcerptFooter'
import ExcerptBody from '../utils/ExcerptBody'
import ExcerptCommentsPreview from '../utils/ExcerptCommentsPreview'

const { log, error } = console

export default ThreadExcerpt

function ThreadExcerpt({ post, expandable, expandPost }) {
  return (
    <article id={`thread-excerpt-${post.id}`} className="excerpt thread-excerpt">
      <ExcerptHeader post={post} user={post.user} />
      <div className="excerpt-body">
        <ExcerptBody post={post} />
        <ExcerptCommentsPreview post={post} />
      </div>
      <ExcerptFooter post={post} format="Thread" />
    </article>
  )
}

import React from 'react'
import ExcerptHeader from '../utils/ExcerptHeader'
import ExcerptFooter from '../utils/ExcerptFooter'
import ExcerptBody from '../utils/ExcerptBody'

const { log, error } = console

export default ArticleExcerpt

function ArticleExcerpt({ post }) {
  return (
    <article id={`article-excerpt-${post.id}`} className="excerpt article-excerpt">
      <ExcerptHeader post={post} user={post.user} />
      <div className="excerpt-body">
        <div className="excerpt-body-main">
          <ExcerptBody post={post} />
        </div>
      </div>
      <ExcerptFooter post={post} format="Article" />
    </article>
  )
}

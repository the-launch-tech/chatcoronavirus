import React from 'react'
import ExcerptHeader from '../utils/ExcerptHeader'
import ExcerptFooter from '../utils/ExcerptFooter'

const { log, error } = console

export default ChatExcerpt

function ChatExcerpt({ post, expandable, expandPost }) {
  return (
    <article id={`chat-excerpt-${post.id}`} className="chat-excerpt expandable">
      <ExcerptHeader post={post} user={post.user} />
      <div className="excerpt-body" onClick={e => expandPost(e, post.slug)}>
        <div
          className="excerpt-rich-excerpt"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
      <ExcerptFooter post={post} format="Chat" />
    </article>
  )
}

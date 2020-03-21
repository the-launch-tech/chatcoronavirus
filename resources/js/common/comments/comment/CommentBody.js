import React from 'react'

export default props => {
  return (
    <div
      className="comment-content"
      dangerouslySetInnerHTML={{ __html: props.comment.content }}
    ></div>
  )
}

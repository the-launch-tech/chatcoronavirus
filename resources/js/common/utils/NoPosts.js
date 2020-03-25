import React from 'react'

export default NoPosts

function NoPosts(props) {
  return (
    <div className="no-posts">
      <p className="no-posts-text">{props.text}</p>
    </div>
  )
}

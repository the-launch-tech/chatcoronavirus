import React from 'react'

export default props => {
  return (
    <button
      type="button"
      onClick={e => props.handleShowChildren(e, props.parentId)}
      className={`${props.isParent ? 'md-btn blue-btn' : 'tiny-btn green-btn show-children-btn'}`}
    >
      <i className="fal fa-spinner" style={{ marginRight: `0.3rem` }}></i>{' '}
      {props.isParent
        ? `Show Discussion (${props.postComments})`
        : `Show More (${props.comment.recursive_children_count})`}
    </button>
  )
}

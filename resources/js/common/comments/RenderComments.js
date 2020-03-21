import React from 'react'
import Comment from './Comment'

export default RenderComments

function RenderComments(props) {
  return props.comments.map((comment, i) => (
    <Comment
      key={i}
      comment={comment}
      user={comment.user}
      depth={props.depth + 1}
      parentId={props.parentId}
      comments={props.comments}
      maxPages={props.maxPages}
      showChildren={props.showChildren}
      handleShowChildren={props.handleShowChildren}
      writingParams={props.writingParams}
      editingParams={props.editingParams}
      handleSave={props.handleSave}
      handleCancel={props.handleCancel}
      handleWriteChange={props.handleWriteChange}
      handleWrite={props.handleWrite}
      handleDelete={props.handleDelete}
      handleEdit={props.handleEdit}
      handleUpdate={props.handleUpdate}
    />
  ))
}

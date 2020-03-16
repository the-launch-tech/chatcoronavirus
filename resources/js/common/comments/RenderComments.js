import React from 'react'
import Comment from './Comment'

export default ({
  editingParams,
  writingParams,
  handleWrite,
  handleUpdate,
  handleCancel,
  handleDelete,
  handleEdit,
  handleSave,
  handleWriteChange,
  handleEditChange,
  comments,
  commentId,
  auth,
  depth,
}) => {
  return comments
    ? comments.map((comment, i) => (
        <Comment
          key={i}
          auth={auth}
          comment={comment}
          commentId={commentId}
          handleWrite={handleWrite}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleEdit={handleEdit}
          handleWriteChange={handleWriteChange}
          handleEditChange={handleEditChange}
          editingParams={editingParams}
          writingParams={writingParams}
          depth={depth + 1}
        />
      ))
    : ''
}

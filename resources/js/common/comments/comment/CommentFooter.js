import React from 'react'
import WriteButton from '../buttons/WriteButton'
import SaveButton from '../buttons/SaveButton'
import UpdateButton from '../buttons/UpdateButton'
import CancelButton from '../buttons/CancelButton'
import EditButton from '../buttons/EditButton'
import DeleteButton from '../buttons/DeleteButton'

export default props => {
  if (props.type === 'WRITE') {
    return (
      <footer className="comment-actions">
        <SaveButton {...props} />
        <CancelButton {...props} />
      </footer>
    )
  } else if (props.type === 'EDIT') {
    return (
      <footer className="comment-actions">
        <UpdateButton {...props} />
        <CancelButton {...props} />
        <DeleteButton {...props} />
      </footer>
    )
  } else {
    return (
      <footer className="comment-actions">
        <WriteButton {...props} targetId={props.comment.id} />
        <EditButton {...props} />
        <DeleteButton {...props} />
      </footer>
    )
  }
}

import React from 'react'
import { connect } from 'react-redux'

const { log, error } = console

const mapStateToProps = ({ Auth }) => {
  return {
    auth: Auth.auth,
  }
}

export default connect(mapStateToProps)(EditButton)

function EditButton(props) {
  if (
    props.auth &&
    !props.writingParams &&
    props.auth.id === props.user.id &&
    !props.editingParams
  ) {
    return (
      <button
        type="button"
        className="tiny-btn orange-btn"
        onClick={e => props.handleEdit(e, { id: props.comment.id, content: props.comment.content })}
      >
        <i className="fal fa-edit"></i>
      </button>
    )
  } else {
    return <React.Fragment />
  }
}

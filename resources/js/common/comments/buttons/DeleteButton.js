import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ Auth }) => {
  return {
    auth: Auth.auth,
  }
}

export default connect(mapStateToProps)(DeleteButton)

function DeleteButton(props) {
  if (props.auth && props.auth.id === props.user.id) {
    return (
      <button
        type="button"
        className="tiny-btn red-btn"
        onClick={e => props.handleDelete(e, { id: props.comment.id })}
      >
        <i className="fal fa-trash-alt"></i>
      </button>
    )
  } else {
    return <React.Fragment />
  }
}

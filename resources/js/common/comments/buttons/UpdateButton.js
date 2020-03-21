import React from 'react'

export default UpdateButton

function UpdateButton(props) {
  return (
    <button type="button" className="tiny-btn green-btn" onClick={props.handleUpdate}>
      <i className="fal fa-save"></i>
    </button>
  )
}

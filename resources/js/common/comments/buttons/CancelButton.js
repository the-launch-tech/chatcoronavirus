import React from 'react'

export default CancelButton

function CancelButton(props) {
  return (
    <button type="button" className="tiny-btn orange-btn" onClick={props.handleCancel}>
      <i className="fal fa-undo"></i>
    </button>
  )
}

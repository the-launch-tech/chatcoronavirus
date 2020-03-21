import React from 'react'

export default SaveButton

function SaveButton(props) {
  return (
    <button type="button" className="tiny-btn green-btn" onClick={props.handleSave}>
      <i className="fal fa-save"></i>
    </button>
  )
}

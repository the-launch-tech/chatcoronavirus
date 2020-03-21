import React from 'react'
import { connect } from 'react-redux'

const { log, error } = console

const mapStateToProps = ({ Auth, Aux }) => {
  return {
    auth: Auth.auth,
    screen: Aux.screen,
  }
}

export default connect(mapStateToProps)(WriteButton)

function WriteButton(props) {
  if (props.auth && !props.writingParams && !props.editingParams) {
    return (
      <button
        type="button"
        className="tiny-btn blue-btn"
        onClick={e => props.handleWrite(e, { parentId: props.targetId })}
      >
        <i className="fal fa-pencil"></i>
        {props.screen !== 'desktop' ? '' : ' Reply'}
      </button>
    )
  } else {
    return <React.Fragment />
  }
}

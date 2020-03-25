import React from 'react'
import { withRouter } from 'react-router'

const { log, error } = console

export default withRouter(ForwardButton)

function ForwardButton(props) {
  function handleForward(event) {
    event.preventDefault()
    props.history.goForward()
  }

  if (props.location.pathname.includes('/dashboard')) {
    return <React.Fragment />
  }

  return (
    <span className="forward-button" onClick={handleForward}>
      <i className="fal fa-arrow-right"></i>
    </span>
  )
}

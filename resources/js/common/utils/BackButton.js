import React from 'react'
import { withRouter } from 'react-router'

const { log, error } = console

export default withRouter(BackButton)

function BackButton(props) {
  function handleBack(event) {
    event.preventDefault()
    props.history.goBack()
  }

  if (props.location.pathname.includes('/dashboard')) {
    return <React.Fragment />
  }

  return (
    <span className="back-button" onClick={handleBack}>
      <i className="fal fa-arrow-left"></i>
    </span>
  )
}

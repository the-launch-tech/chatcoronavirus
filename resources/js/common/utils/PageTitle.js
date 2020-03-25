import React from 'react'
import { connect } from 'react-redux'

const { log, error } = console

export default connect(({ Aux }) => {
  return {
    pageTitle: Aux.pageTitle,
  }
})(PageTitle)

function PageTitle(props) {
  if (props.pageTitle.showCurrent) {
    return <h3 className="absolute-title">{props.pageTitle.current}</h3>
  } else {
    return <React.Fragment />
  }
}

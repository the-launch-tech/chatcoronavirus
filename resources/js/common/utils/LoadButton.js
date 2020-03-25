import React from 'react'
import { connect } from 'react-redux'
import NoPosts from './NoPosts'

const { log, error } = console

export default connect(({ Aux }) => {
  return {
    loading: Aux.loading,
  }
})(LoadButton)

function LoadButton(props) {
  if (!props.loading && props.empty) {
    return <NoPosts text={props.text} />
  } else if (!props.loading && !props.empty) {
    return (
      <button className="load-more-button green-btn md-btn" onClick={props.loadMore}>
        <i className="fad fa-spinner"></i> More
      </button>
    )
  } else {
    return <React.Fragment />
  }
}

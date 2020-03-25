import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

const { log } = console

export default withRouter(connect()(Public))

function Public({ children, page, dispatch, match, location }) {
  const [lastPage, setLastPage] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
      setLastPage(page)
    }, 300)
  }, [])

  useEffect(() => {
    setTimeout(() => setVisible(true), 300)

    return () => {
      setVisible(false)
    }
  }, [location.pathname])

  return (
    <div
      id="page-content"
      className={`page-content ${children.props.page} ${
        visible || lastPage === page ? 'active-page' : 'hidden-page'
      }`}
    >
      {children}
    </div>
  )
}

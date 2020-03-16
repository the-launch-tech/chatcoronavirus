import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import mapAuth from '../helpers/mapAuth'
import loader from '../helpers/loader'
import DashboardHeader from '../common/DashboardHeader'

const { log } = console

export default withRouter(connect(mapAuth)(Dashboard))

function Dashboard({ children, auth, page, dispatch, match, location }) {
  useEffect(() => {
    loader(dispatch, false)
  }, [location.pathname, match.params])

  return (
    <div id="page-wrapper" className={`page-wrapper ${children.props.page}`}>
      <div id="page-content" className={`page-content ${children.props.page}`}>
        <DashboardHeader auth={auth} />
        {children}
      </div>
    </div>
  )
}

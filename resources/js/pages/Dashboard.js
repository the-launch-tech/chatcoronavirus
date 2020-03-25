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
    <React.Fragment>
      <DashboardHeader auth={auth} />
      {children}
    </React.Fragment>
  )
}

import React from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'
import actions from '../../store/actions'

const { log, errors } = console

export default connect(mapAuth)(NoMatch)

function NoMatch({ dispatch, page }) {
  loader(dispatch, false, 100)

  useEffect(() => {
    dispatch(actions.AUX.updatePageTitle({ pageTitle: `Resource Not Found`, showCurrent: true }))
  }, [])

  return (
    <React.Fragment>
      <h4>You're In The Danger Zone</h4>
    </React.Fragment>
  )
}

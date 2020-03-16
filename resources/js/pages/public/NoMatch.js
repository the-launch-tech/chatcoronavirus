import React from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, errors } = console

export default connect(mapAuth)(NoMatch)

function NoMatch({ dispatch, page }) {
  loader(dispatch, false, 100)

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <h1>You're In The Danger Zone</h1>
      </div>
    </div>
  )
}

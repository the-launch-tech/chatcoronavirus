import React from 'react'
import { connect } from 'react-redux'
import loader from '../../helpers/loader'
import mapAuth from '../../helpers/mapAuth'

const { log, error } = console

export default connect(mapAuth)(User)

function User({ dispatch, page, auth, match }) {
  loader(dispatch, false)

  return (
    <div id="page-wrapper" className={`page-wrapper ${page}`}>
      <div id="page-content" className={`page-content ${page}`}>
        <h5 className="timeline-title">{`${match.params.username}'s Timeline`}</h5>
        <div className="feature-coming-soon-page">
          <h3>Feature Coming Soon...</h3>
          <p>
            Public user timelines with follows, and reposts coming soon! You can currently follow
            other users to preemptively build your network now, so that when the feature arrives
            you've got a head start.
          </p>
        </div>
      </div>
    </div>
  )
}

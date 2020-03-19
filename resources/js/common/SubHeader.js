import React from 'react'
import { connect } from 'react-redux'

const { log } = console

const mapStateToProps = ({ Aux }) => {
  return {
    googleUpdates: Aux.googleUpdates,
    screen: Aux.screen,
  }
}

export default connect(mapStateToProps)(SubHeader)

function SubHeader({ googleUpdates, screen }) {
  return (
    <div className="sub-header-container">
      <div className="sub-header-left">
        <h6 className="sub-header-left-title">
          <i className="fal fa-lightbulb-exclamation"></i>
          {screen === 'desktop' ? 'Current Updates' : ''}
        </h6>
      </div>
      <div className="sub-header-roll">
        {googleUpdates &&
          googleUpdates.map((update, i) => (
            <span key={i} className="sub-header-roll-item">
              <a className="sub-header-roll-anchor" href={update.url} target="_blank">
                {update.title.length > 50 ? update.title.substr(0, 50) + '...' : update.title}
              </a>
            </span>
          ))}
      </div>
    </div>
  )
}

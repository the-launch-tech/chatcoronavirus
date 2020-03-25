import React from 'react'
import { connect } from 'react-redux'
import actions from '../../../store/actions'

export default connect(({ Aux, Auth }) => {
  return {
    timelineContent: Aux.timelineContent,
    isAuthenticated: Auth.isAuthenticated,
  }
})(TimelineForm)

function TimelineForm({ isAuthenticated, timelineContent, dispatch, resetTimeline }) {
  if (!isAuthenticated) {
    return <React.Fragment />
  }

  function handleSelectChange(event) {
    event.preventDefault()
    Array.from(event.target.children).map(child => {
      if (child.selected) {
        dispatch(actions.AUX.updateTimelineContent(child.value))
      }
    })
  }

  return (
    <div className="timeline-form form-wrapper">
      <div className="form-content">
        <div className="form-block">
          <div className="form-row">
            <div className="form-cell w-100">
              <select
                className="form-input"
                name="timeline"
                onChange={handleSelectChange}
                defaultValue={timelineContent}
              >
                <option value="personalized">Personalized Timeline</option>
                <option value="public">Public Timeline</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

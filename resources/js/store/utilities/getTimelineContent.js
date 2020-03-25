import actions from '../actions'

export default function(dispatch) {
  if (localStorage.getItem('cc_timelineContent')) {
    dispatch(actions.AUX.updateTimelineContent(localStorage.getItem('cc_timelineContent')))
  }
}

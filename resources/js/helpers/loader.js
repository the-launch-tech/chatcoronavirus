import actions from '../store/actions'

export default function(dispatch, bool = true, time = 500) {
  if (bool) {
    dispatch(actions.AUX.toggleLoading(bool))
  } else {
    setTimeout(() => dispatch(actions.AUX.toggleLoading(bool)), time)
  }
}

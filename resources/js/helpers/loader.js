import * as actions from '../store/actions'

export default function(dispatch, bool = true, time = 500) {
  if (bool) {
    dispatch(actions.auxLoading(bool))
  } else {
    setTimeout(() => dispatch(actions.auxLoading(bool)), time)
  }
}

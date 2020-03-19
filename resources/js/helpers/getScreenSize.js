import * as actions from '../store/actions'

export default function(dispatch) {
  if (window.innerWidth > 991) {
    dispatch(actions.auxScreen('desktop'))
  } else if (window.innerWidth > 599) {
    dispatch(actions.auxScreen('tablet'))
  } else {
    dispatch(actions.auxScreen('mobile'))
  }
}

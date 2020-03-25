import actions from '../actions'

export default function(dispatch) {
  if (window.innerWidth > 991) {
    dispatch(actions.AUX.updateScreen('desktop'))
  } else if (window.innerWidth > 599) {
    dispatch(actions.AUX.updateScreen('tablet'))
  } else {
    dispatch(actions.AUX.updateScreen('mobile'))
  }
}

import actions from '../actions'

export default function(dispatch) {
  if (localStorage.getItem('cc_theme')) {
    dispatch(actions.AUX.toggleTheme(localStorage.getItem('cc_theme')))
  }
}

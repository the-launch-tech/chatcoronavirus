export default (action, value = null) => {
  if (action === 'set') {
    return localStorage.setItem('cc_access', value)
  } else if (action === 'remove') {
    return localStorage.removeItem('cc_access')
  } else {
    return localStorage.getItem('cc_access')
  }
}

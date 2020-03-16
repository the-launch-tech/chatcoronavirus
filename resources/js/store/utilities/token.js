export default (action, value = null) => {
  if (action === 'set') {
    return localStorage.setItem('cc_jwt_token', value)
  } else if (action === 'remove') {
    return localStorage.removeItem('cc_jwt_token')
  } else {
    return localStorage.getItem('cc_jwt_token')
  }
}

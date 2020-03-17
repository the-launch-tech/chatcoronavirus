export default function(pathname = '/') {
  return window.location.protocol + '//' + window.location.host + pathname
}

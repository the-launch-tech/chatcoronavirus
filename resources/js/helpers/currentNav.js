export default function(location, options = [], color = 'green') {
  return options.filter(option => location.pathname === option).length > 0
    ? 'current-nav-item current-' + color
    : ''
}

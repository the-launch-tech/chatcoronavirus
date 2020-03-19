export default function(role, screen) {
  if (role === 'Medical Official' && screen !== 'desktop') {
    return 'Official'
  } else {
    return role
  }
}

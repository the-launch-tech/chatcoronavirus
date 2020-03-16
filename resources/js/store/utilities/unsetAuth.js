import jwtToken from './token'
import access from './access'
import ttl from './ttl'

export default () => {
  jwtToken('remove')
  access('remove')
  ttl('remove')
}

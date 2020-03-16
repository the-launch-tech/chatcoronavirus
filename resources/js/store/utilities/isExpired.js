import ttl from './ttl'

export default () => {
  const previousTime = ttl()
  if (!previousTime) {
    return true
  }
  const currentTime = new Date()
  const diffMs = currentTime - previousTime
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
  return Math.abs(diffMins) > parseInt(86400)
}

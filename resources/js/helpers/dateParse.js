import moment from 'moment'

const { log, error } = console

export default function(date) {
  const current = moment(Date.now())
  const previous = moment(date)

  const days = current.diff(previous, 'days')
  const hours = current.diff(previous, 'hours')
  const minutes = current.diff(previous, 'minutes')
  const seconds = current.diff(previous, 'seconds')

  if (days > 0) {
    return `${days} days ago`
  } else if (hours > 0) {
    return `${hours % 24} hours ago`
  } else if (minutes > 0) {
    return `${minutes % 60} minutes ago`
  } else {
    return `${seconds % 60} seconds ago`
  }
}

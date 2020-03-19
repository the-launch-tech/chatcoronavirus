import moment from 'moment'

const { log, error } = console

export default function(date) {
  const current = moment(Date.now())
  const previous = moment(date)

  const days = current.diff(previous, 'days')
  const hours = current.diff(previous, 'hours')
  const minutes = current.diff(previous, 'minutes')
  const seconds = current.diff(previous, 'seconds')

  if (days > 1) {
    return `${days} day${days === 1 ? '' : 's'}`
  } else if (hours > 1) {
    return `${hours % 24} hour${hours % 24 === 1 ? '' : 's'}`
  } else if (minutes > 1) {
    return `${minutes % 60} min${minutes % 60 === 1 ? '' : 's'}`
  } else {
    return `${seconds % 60} sec${seconds % 60 === 1 ? '' : 's'}`
  }
}

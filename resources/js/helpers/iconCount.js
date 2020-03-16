export default function(n) {
  const count = parseInt(n)
  if (!count) {
    return 0
  } else if (count < 1000) {
    return count
  } else if (count >= 1000 && count < 1000000) {
    return `${parseFloat(count / 1000).toFixed(2)}K`
  } else if (count >= 1000000) {
    return `${parseFloat(count / 1000000).toFixed(2)}M`
  }
}

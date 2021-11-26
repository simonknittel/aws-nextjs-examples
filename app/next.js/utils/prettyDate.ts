export default function prettyDate(value: Date) {
  const now = Date.now()

  const difference = Math.round((now - value.getTime()) / 1000)

  if (difference < 30) {
    return 'few seconds ago'
  } else if (difference < 60) {
    return `${ difference } seconds ago`
  } else if (difference < (60 * 60)) {
    return `${ Math.round(difference / 60) } minutes ago`
  } else if (difference < (60 * 60 * 24)) {
    return `${ Math.round(difference / 60 / 60) } hours ago`
  } else if (difference < (60 * 60 * 24 * 7)) {
    return `${ Math.round(difference / 60 / 60 / 24) } days ago`
  } else if (difference < (60 * 60 * 24 * 7 * 30)) {
    return `${ Math.round(difference / 60 / 60 / 24 / 7) } months ago`
  } else {
    return value.toLocaleString()
  }
}

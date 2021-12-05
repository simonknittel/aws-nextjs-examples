export default function prettyDate(value: Date) {
  const now = Date.now()

  const age = Math.round((now - value.getTime()) / 1000)

  if (age < 30) return 'few seconds ago'
  else if (age < 60) return `${ age } seconds ago`
  else if (age < (60 * 60)) return `${ Math.round(age / 60) } minutes ago`
  else if (age < (60 * 60 * 24)) return `${ Math.round(age / 60 / 60) } hours ago`
  else if (age < (60 * 60 * 24 * 7)) return `${ Math.round(age / 60 / 60 / 24) } days ago`
  else if (age < (60 * 60 * 24 * 7 * 30)) return `${ Math.round(age / 60 / 60 / 24 / 7) } weeks ago`

  return value.toLocaleString()
}

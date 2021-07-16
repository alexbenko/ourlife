export default function generateDatestamp (date : Date) {
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()

  return `${year}-${month}-${day}`
}

import crypto from 'crypto'

export default function randomString (bytes: number = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

import jwt from 'jsonwebtoken'
import redisHelpers from '../redis/redisHelpers'
import { randomString } from '.'

export default async function generateToken (userData : {}) {
  // TODO ADD a redis helper that accomplishes this functionality
  let tokenSecret = await redisHelpers.get('tokenSecret')

  if (!tokenSecret) {
    tokenSecret = randomString(128)
    await redisHelpers.set('tokenSecret', tokenSecret, 86400)
  }
  return jwt.sign(userData, tokenSecret, { expiresIn: '86400s' })
}

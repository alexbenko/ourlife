import jwt from 'jsonwebtoken'
import redisHelpers from '../redis/redisHelpers'
import { Request, Response, NextFunction } from 'express'
import { log, randomString } from '.'

const authenticateToken = async function (req, res : Response, next : NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null) return res.sendStatus(401)
  let tokenSecret = await redisHelpers.get('tokenSecret')

  if (!tokenSecret) {
    tokenSecret = randomString(128)
    await redisHelpers.set('tokenSecret', tokenSecret, 86400)
  }

  jwt.verify(token, tokenSecret as string, (err: any, user: any) => {
    log.error(err)

    if (err) return res.sendStatus(403).send('Invalid Token. Please Login Again')

    req.user = user

    next()
  })
}

const generateToken = async function (userData : {}) {
  // TODO ADD a redis helper that accomplishes this functionality
  let tokenSecret = await redisHelpers.get('tokenSecret')

  if (!tokenSecret) {
    tokenSecret = randomString(128)
    await redisHelpers.set('tokenSecret', tokenSecret, 86400)
  }
  return jwt.sign(userData, tokenSecret, { expiresIn: '86400s' })
}

const token = {
  authenticateToken,
  generateToken
}
export default token

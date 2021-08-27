import jwt from 'jsonwebtoken'
// import redisHelpers from '../redis/redisHelpers'
import { Request, Response, NextFunction } from 'express'
import { log } from '.'
require('dotenv').config()
const TOKEN_SECRET = process.env.TOKEN_SECRET

const authenticateTokenMiddleware = async function (req : Request, res : Response, next : NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null) return res.sendStatus(401)
  /*
  let tokenSecret = await redisHelpers.get('tokenSecret')

  if (!tokenSecret) {
    tokenSecret = randomString(128)
    await redisHelpers.set('tokenSecret', tokenSecret, 86400)
  }
  */
  jwt.verify(token, TOKEN_SECRET as string, (err) => {
    // log.error(err as string)

    if (err) return res.sendStatus(403).send('Invalid Token. Please Login Again')

    next()
  })
}

const generateToken = async function (userData = {}, expiration: string = '86400s') {
  // TODO ADD a redis helper that accomplishes this functionality
  /*
  let tokenSecret = await redisHelpers.get('tokenSecret')

  if (!tokenSecret) {
    tokenSecret = randomString(128)
    await redisHelpers.set('tokenSecret', tokenSecret, 86400)
  }
  */
  return jwt.sign(userData, TOKEN_SECRET, { expiresIn: expiration })
}

const authenticateToken = (token) => {
  let valid : boolean
  jwt.verify(token, TOKEN_SECRET as string, (err, decoded) => {
    if (err || !decoded) {
      log.error(err, false)
      valid = false
    } else {
      valid = true
    }
  })
  return valid
}

const token = {
  authenticateTokenMiddleware,
  generateToken,
  authenticateToken
}
export default token

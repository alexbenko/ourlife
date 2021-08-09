import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import redisHelpers from '../redis/redisHelpers'
import { log, randomString } from '../lib'

export default async function authenticateToken (req, res : Response, next : NextFunction) {
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

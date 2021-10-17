import { Request, Response, NextFunction } from 'express'
import { log } from '../lib'
import client from './redisClient'

const ipHashKey = 'bannedIp'

function banIp (ip : string) {
  client.hmsetAsync(ipHashKey, { [ip]: 0 })
  log.info(`Banned Ip : ${ip}`)
}

async function get (key: string) {
  return client.getAsync(key)
}

async function set (key, value, expiration = null) {
  client.setAsync(key, value as string, expiration ? 'EX' : null, expiration)
}

/**
 * Middleware that checks the ip of every request and compares it to the banned ip dataset. If the ip is in the dataset,
 * It 404s. Only meant to be used as a midddleware function
 */
async function isBanned (req: Request, res: Response, next: NextFunction) {
  try {
    const ip = req.ip
    const data: string[] = await client.hgetAsync(ipHashKey, ip)
    if (data) {
      log.info(`Attempt from banned ip adress : ${ip}`, true)
      let parsedValue = Number(data[0])
      parsedValue++

      // key value looks like [ip] : [number of attempts since banned]
      // if an ip attempts againt this increments the value to keep track in case you need to know.
      client.hmsetAsync(ipHashKey, { [ip]: parsedValue })

      res.status(400).send({ admininfo: 'https://http.cat/400' })
    } else {
      next()
    }
  } catch (err) {
    log.error(`Error Checking Ip: ${err}`)
    res.status(400).send('Error')
  }
}

const redisHelpers = {
  banIp,
  isBanned,
  get,
  set
}

export default redisHelpers

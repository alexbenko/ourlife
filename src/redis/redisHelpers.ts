import { Request, Response, NextFunction } from 'express'
import { log } from '../lib'
import client from './redisClient'

const ipHashKey = 'bannedIp'

async function banIp (ip : string) {
  await client.setAsync(ip, JSON.stringify({ attempts: 0 }))
  log.info(`Banned Ip : ${ip}`)
}

/**
 * Middleware that checks the ip of every request and compares it to the banned ip dataset. If the ip is in the dataset,
 * It 404s. Only meant to be used as a midddleware function
 */
async function isBanned (ip : string, req: Request, res: Response, next: NextFunction) {
  try {
    const data: string[] = await client.hmgetAsync(ipHashKey, ip)
    if (data[0]) {
      log.info(`Attempt from banned ip adress : ${ip}`, true)
      let parsedValue = Number(data[0])
      parsedValue++

      // key value looks like [ip] : [number of attempts since banned]
      // if an ip attempts againt this increments the value to keep track in case you need to know.
      client.hmset(ipHashKey, { [ip]: parsedValue })

      res.status(404)
    } else {
      next()
    }
  } catch (err) {
    log.error(`Error Checking Ip: ${err}`)
    res.status(404)
  }
}

const redisHelpers = {
  banIp,
  isBanned
}

export default redisHelpers

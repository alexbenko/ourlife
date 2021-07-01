import redis, { RedisError } from 'redis'
import { Request, Response, NextFunction } from 'express'
import { promisify } from 'util'
import log from '../logging/log'

const ipHashKey = 'bannedIp'
const client = redis.createClient(process.env?.REDIS_URL)
const hmgetAsync = promisify(client.hmget).bind(client) // wrap hmget in a promise

client.on('connect', function () {
  console.log('Successfully connected to redis!')
})

client.on('error', function (error : RedisError) {
  log.error(`Redis Error: ${error}`)
})

function banIp (ip : string): void {
  client.hmset(ipHashKey, { [ip]: 0 }, (err) => {
    if (err) {
      log.error(err)
    } else {
      log.info(`Banned Ip : ${ip}`)
    }
  })
  client.quit()
}

/**
 * Middleware that checks the ip of every request and compares it to the banned ip dataset. If the ip is in the dataset,
 * It 404s. Only meant to be used as a midddleware function
 */
async function isBanned (ip : string, req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data: string[] = await hmgetAsync(ipHashKey, ip)
    if (data[0]) {
      log.info(`Attempt from banned ip adress : ${ip}`)
      let parsedValue = Number(data[0])
      parsedValue++

      // key value looks like [ip] : [number of attempts since banned]
      // if an ip attempts againt this increments the value to keep track in case you need to know.
      client.hmset(ipHashKey, { [ip]: parsedValue })

      res.status(404)
    } else {
      next()
    }
    client.quit()
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

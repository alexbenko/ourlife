import redis from 'redis'
import { promisify } from 'util'

// this environemnt variable is only set in the docker compose file
const client = redis.createClient(process.env?.REDIS_URL)

client.on('connect', function () {
  console.log('Successfully connected to redis!')
})

export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  hmsetAsync: promisify(client.hmset).bind(client),
  hmgetAsync: promisify(client.hmget).bind(client),
  hgetAsync: promisify(client.hget).bind(client),
  keysAsync: promisify(client.keys).bind(client)
}

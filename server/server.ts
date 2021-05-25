// third party
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cron from 'node-cron'
import path from 'path'

// custom packages
import log from './logging/log'
import redisHelpers from './redis/redisHelpers'
import backup from './jobs/backup'
import db from './postgresql/db'

// routers
import albumrouter from './router/albumRouter'

const rfs = require('rotating-file-stream')
require('dotenv').config()

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(cors())
// this modifies the security policy so it can load files from external domains
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 's3.amazonaws.com', 'i.imgur.com']
      }
    }
  })
)

const environment = process.env.ENVIRONMENT
if (!environment) {
  console.log('No .env file, please create one using the enviornment variables in the README')
  // dont want server to start if enviornment variables havent been set
  process.exit(1)
} else if (!process.env.AWS_ACCESS_KEY) {
  console.log('No AWS Acess Key in .env file. Please add it before continuing.')
  process.exit(1)
}
// if in dev mode
if (environment !== 'production') {
  console.log('Development Mode detected, all logs will be logged to console instead of saving them.')
  app.use(morgan('dev'))
} else {
  console.log('Production Environment Detected, saving http logs and scheduling cronjobs')
  const generateDatestamp = () : string => {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    return `${year}-${month}-${day}`
  }
  const accessLogStream = rfs.createStream(`${generateDatestamp()}.log`, {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs/http')
  })

  // setup the log
  app.use(morgan('combined', { stream: accessLogStream }))

  // all cronjobs should go here     0 0 * * FRI
  cron.schedule('0 0 * * FRI', backup.backupLogs) // friday at midniight
  cron.schedule('0 0 * * * ', backup.backupDb) // every day at midnight
}

app.get('/admin', redisHelpers.isBanned, (req: express.Request, res : express.Response) => {
  redisHelpers.banIp(req.ip)
  res.status(418).send(';)')
})

app.use('/', express.static(path.join(__dirname, '../client/dist')))

app.use('/api/albums', redisHelpers.isBanned, albumrouter)
app.listen(port, async () => {
  console.log(`app listening at http://localhost:${port} in ${environment} mode.`)
  try {
    const test = await db('SELECT * FROM albums;')
    if (environment === 'production' && test.length === 0) {
      throw new Error('Album table is not set up yet.')
    }
    console.log('Connected to database successfully!')
  } catch (err) {
    log.error(`Failed to connect to db: ${err.message}`)
    process.exit(1)
  }
})

process.on('uncaughtException', err => {
  log.error(`Uncaught Error: ${err}`)
  process.exit(1) // manadatory (as per the Node.js docs)
})

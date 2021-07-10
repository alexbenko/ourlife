import path from 'path'
import moment from 'moment-timezone'
import sendErrorEmail from '../email/sendErrorEmail'

require('dotenv').config()
const rfs = require('rotating-file-stream')

const inProduction = process.env.ENVIRONMENT === 'production' || process.env.NODE_ENV === 'production'

function generateDatestamp () {
  const dateObj = new Date()
  const month = dateObj.getUTCMonth() + 1
  const day = dateObj.getUTCDate()
  const year = dateObj.getUTCFullYear()

  return `${year}-${month}-${day}`
}

// time format is saved in UTC
const generateTimeStamp = () => moment().tz('America/Los_Angeles').format('hh:mm a')

/**
   * Used To log any errors to aid in debugging and have a permanent record of them.
   * @param err - the error thrown , ie in the catch block OR in a if(conditionNotMet) {}
*/
const error = function (err:string, sendEmail = false) {
  if (!inProduction) {
    console.log('\x1b[31m', err)
  } else {
    if (sendEmail) sendErrorEmail('ENCOUNTERED ERROR IN PRODUCTION', err)
    const date = generateDatestamp()
    const time = generateTimeStamp()
    const toErrorLog = rfs.createStream(`${date}.log`, {
      interval: '1d',
      path: path.join(__dirname, '../logs/errors')
    })
    toErrorLog.write(`[${time}] ${err}\n`)
  }
}

/**
   * Used To log any general info about the application. Useful for statistics, keeping track of how many times your endpoint.
   * @param info - the error thrown , ie in the catch block OR in a if(conditionNotMet) {}
*/
const info = function (info : any) {
  if (!inProduction) {
    console.log('\x1b[36m%s\x1b[0m', info)
  } else {
    const date = generateDatestamp()
    const time = generateTimeStamp()
    const toInfoLog = rfs.createStream(`${date}.log`, {
      interval: '1d',
      path: path.join(__dirname, '../logs/info')
    })
    toInfoLog.write(`[${time}] ${info}\n`)
  }
}

const log = {
  info,
  error
}

export default log

import AWS from 'aws-sdk'
import path from 'path'
import fs from 'fs'

import { fsAsync, log } from '../lib'
import { s3Params } from '../interfaces/aws'

require('dotenv').config()

const bucketName = process.env.S3_BUCKET_NAME
/**
 * Used to backup the log files to S3 for the app. Will only work properly for the logs directory.
 */
export default async function () {
  try {
    const logFolderPath = path.join(__dirname, '../logs')

    // read root of log directory
    const folders = await fsAsync.readdir(logFolderPath)
    // loop through each child directory
    for (const childDirectorty of folders) {
      if (childDirectorty.includes('.')) {
        // if it encounters a file i dont want to upload it since it shouldnt be here
        log.error(`Encountered a file, instead of a directory: ${childDirectorty}`)
        continue
      }
      const fullChildFilePath = `${logFolderPath}/${childDirectorty}`

      const logs = await fsAsync.readdir(fullChildFilePath)

      for (const file of logs) {
        if (!file.includes('.log')) {
          log.error(`Encountered non log file: ${file}`)
          continue
        }
        const fullFilePath = `${fullChildFilePath}/${file}`
        const fileBuffer = await fsAsync.readFile(fullFilePath)

        const params : s3Params = {
          Bucket: bucketName,
          Key: `${childDirectorty}/${file}`,
          Body: fileBuffer
        }

        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })

        s3.upload(params, (err) => {
          if (err) throw err
        })
      }
    }
    log.info('Successfully Uploaded Logs to S3, deleting log directory.')
    fs.rmdirSync(logFolderPath, { recursive: true })
    return true
  } catch (err) {
    log.error(`Error Backingup Logs: ${err}`, true)
    return false
  }
}

import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import log from '../logging/log'
import { promisify } from 'util'
import { exec } from 'child_process'
require('dotenv').config()

// promify used fs moduels since they dont return promises
const fsAsync = {
  readdir: promisify(fs.readdir),
  readFile: promisify(fs.readFile)
}
const bucketName = process.env.S3_BUCKET_NAME

interface s3Params{
  Bucket: string,
  Key: string,
  Body: Buffer
}
/**
 * Used to backup the log files to S3 for the app. Will only work properly for the logs directory.
 */
const backupLogs = async () : Promise<boolean> => {
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
    log.error(`Error Backingup Logs: ${err}`)
    return false
  }
}

const backupDb = async () => {
  try {
    log.info('Backing up database to S3')

    // this is in a function to ensure the database is dumped before upload and then deleted
    const dumpDB = async () => {
      exec('sh server/scripts/backup_pg.sh', (error, stdout) => {
        if (error !== null) throw error
        if (stdout.includes('.env')) throw stdout
      })
    }

    await dumpDB()
    const dbBackupFilePath = path.join(__dirname, '../../db_backup.bak')
    console.log(dbBackupFilePath)
    const fileBuffer = await fsAsync.readFile(dbBackupFilePath)

    const params : s3Params = {
      Bucket: bucketName,
      Key: `db_backup/${Date.now()}`,
      Body: fileBuffer
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })

    s3.upload(params, (err) => {
      if (err) throw err
    })
    fs.unlinkSync(dbBackupFilePath)
  } catch (err) {
    log.error(`Error backing up Database: ${err}`)
  }
}

const backup = {
  backupLogs,
  backupDb
}

export default backup

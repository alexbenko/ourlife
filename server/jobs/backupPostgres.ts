import { exec } from 'child_process'
import path from 'path'
import AWS from 'aws-sdk'
import fs from 'fs'
import { log, fsAsync } from '../lib'
require('dotenv').config()

const bucketName = process.env.S3_BUCKET_NAME

interface s3Params{
  Bucket: string,
  Key: string,
  Body: Buffer
}
export default async function () {
  try {
    log.info('Backing up database to S3')

    // this is in a async function to ensure the database is dumped before upload
    const dumpDB = async () => {
      const backupScriptPath = path.join(__dirname, '../scripts/backup_pg.sh')
      exec(`sh ${backupScriptPath}`, (error, stdout) => {
        if (error !== null) throw error
        if (stdout.includes('.env')) throw stdout
      })
    }

    await dumpDB()
    const dbBackupFilePath = path.join(__dirname, '../../db_backup.bak')
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
    log.error(`Error backing up Database: ${err}`, true)
  }
}

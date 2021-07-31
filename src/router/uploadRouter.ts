import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

import db from '../postgresql/db'
import { log, compress } from '../lib'

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

// child route of /api/upload
router.post('/single/:albumId', upload.single('file'), async (req : Request, res: Response) => {
  try {
    const { albumId } = req.params
    const existingAlbum = await db('SELECT id, dirname from albums WHERE id = $1', [albumId])
    if (!existingAlbum.length) {
      res.status(201).send('Album Does Not exist')
    } else {
      // multer stores the image as a buffer here
      const { buffer, originalname } = req.file

      const staticFilePath = process.env.NODE_ENV === 'production' ? '../static' : '../../static'
      const photoFolderPath = path.join(__dirname, staticFilePath)
      const url = `/photos/${existingAlbum[0].dirname}/${originalname.split('.')[0]}.webp`
      const newImagePath = photoFolderPath + url

      await compress(buffer, newImagePath)
      res.send(url)
    }
  } catch (err) {
    log.error(`Error uploading a single Image: ${err}`)
    res.status(400).send('Failed')
  }
})

export default router

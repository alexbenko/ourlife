import express from 'express'
import db from '../postgresql/db'
import { log } from '../lib'

const router = express.Router()
// child route of /api/albums
router.get('/all', async (req, res) => {
  const albumsInfo = await db('SELECT id,displayname FROM albums;')
  res.send(albumsInfo)
})

router.get('/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params
    const album = await db('SELECT * FROM images WHERE albumid = $1', [albumId])

    res.send(album)
  } catch (err) {
    log.error(`Error Retrieving Albumid:${req.params.albumId}: ${err}`)
    res.status(400)
  }
})

export default router

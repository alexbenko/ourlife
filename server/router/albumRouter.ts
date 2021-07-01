import express from 'express'
import db from '../postgresql/db'
import log from '../logging/log'

const router = express.Router()
// child route of /api/albums
router.get('/ping', (req, res) => res.send('Pong'))

router.get('/all', async (req, res) => {
  const albumsInfo = await db('SELECT * FROM albums;')
  res.send(albumsInfo)
})

router.get('/:albumId', async (req, res) => {
  const { albumId } = req.params
  console.info(albumId)
  const album = await db('SELECT * FROM images WHERE album_id = $1', [albumId])
  res.send(album)
})

export default router

import db from '../postgresql/db'
import { ImgurClient } from 'imgur'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

require('dotenv').config()
const fsAsync = {
  readdir: promisify(fs.readdir),
  readFile: promisify(fs.readFile)
}

const uploadToImugr = async () => {
  try {
    const client = new ImgurClient({ accessToken: process.env.ACCESS_TOKEN })
    client.on('uploadProgress', (progress) => console.log(progress.precent * 100, '%'))

    const photoFolderPath = path.join(__dirname, '../../photos')
    const albums = await fsAsync.readdir(photoFolderPath)
    for (const album of albums) {
      if (album.includes('.')) continue

      await db('INSERT INTO ALBUMS(album_name) VALUES($1)', [album])
      const albumId = await db('SELECT id FROM albums WHERE album_name = $1', [album])

      const fullAlbumPath = `${photoFolderPath}/${album}`
      const imagesInAlbum = await fsAsync.readdir(fullAlbumPath)
      // imugr api requires absolute file paths
      const toUpload = imagesInAlbum.filter(img => img !== '.DS_Store').map(img => fullAlbumPath + '/' + img)
      const responses = await client.upload(toUpload)
      console.log(responses)
      // break

      for (const i in responses) {
        await db('INSERT INTO images(album_id,img_url) VALUES($1,$2)', [albumId, responses[i].data.link])
      }
    }
  } catch (err) {
    console.log('Failed: ', err)
  }
}

uploadToImugr()
// export default uploadToImugr

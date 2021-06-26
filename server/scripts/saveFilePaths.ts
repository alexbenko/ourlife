import db from '../postgresql/db'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

require('dotenv').config()
// TODO: move the promisifed fs to its own module since i use it in a few other files
const fsAsync = {
  readdir: promisify(fs.readdir),
  readFile: promisify(fs.readFile)
}
const capitalizeWord = (word) =>{
  const text = word.split('')
  text[0] = text[0].toUpperCase()
  return text.join('')
}
const formatAlbumName = (text:string) => {
  let formatted : string
  if (text.includes('_')) {
    // ie crater_lake => Crater Lake
    formatted = text.split('_').join(' ').split(' ').map((s) => capitalizeWord(s)).join(' ')
  } else {
    // acadia => Acadia
    formatted = capitalizeWord(text)
  }

  return formatted
}

const saveFilePaths = async () => {
  try {
    const photoFolderPath = path.join(__dirname, '../static/photos')
    const albums = await fsAsync.readdir(photoFolderPath)

    // eslint-disable-next-line array-callback-return
    const result = await Promise.all(albums.map(async (album) => {
      if (album.includes('.')) return false // these are directories and should not include any files

      const albumName = formatAlbumName(album)
      await db('INSERT INTO ALBUMS(album_name) VALUES($1);', [albumName])
      const albumId = await db('SELECT id FROM albums WHERE album_name = $1;', [albumName])
      const { id } = albumId[0]

      const fullAlbumPath = `${photoFolderPath}/${album}`
      const imagesInAlbum = await fsAsync.readdir(fullAlbumPath)
      const imagePaths = imagesInAlbum.filter(img => img !== '.DS_Store').map(img => fullAlbumPath + '/' + img)

      for (const imageUrl of imagePaths) {
        await db('INSERT INTO IMAGES(album_id, img_url) VALUES($1,$2);', [id, imageUrl.split('/photos')[1]])
      }
      return true
    }))
    console.log(result)
    console.log('Successfully Saved All Image File Paths')
    process.exit(1)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

saveFilePaths()
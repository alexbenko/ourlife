import db from './db'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

require('dotenv').config()
// TODO: move the promisifed fs to its own module since i use it in a few other files
const fsAsync = {
  readdir: promisify(fs.readdir),
  readFile: promisify(fs.readFile)
}
const capitalizeWord = (word) => {
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
  const staticFilePath = process.env.NODE_ENV === 'production' ? '../static/photos' : '../../static/photos'
  const photoFolderPath = path.join(__dirname, staticFilePath)
  const albums = await fsAsync.readdir(photoFolderPath)

  // eslint-disable-next-line array-callback-return
  const result = await Promise.all(albums.map(async (album) => {
    if (album.includes('.')) return false // these are directories and should not include any files

    // const albumName = formatAlbumName(album)
    await db('INSERT INTO ALBUMS(dirName, displayName) VALUES($1, $2);', [album, formatAlbumName(album)])
    const albumId = await db('SELECT id FROM albums WHERE dirName = $1;', [album])
    const { id } = albumId[0]

    const fullAlbumPath = `${photoFolderPath}/${album}`
    const imagesInAlbum = await fsAsync.readdir(fullAlbumPath)
    const imagePaths = imagesInAlbum.filter(img => img !== '.DS_Store').map(img => fullAlbumPath + '/' + img)

    for (const imageUrl of imagePaths) {
      await db('INSERT INTO IMAGES(albumId, imgUrl) VALUES($1,$2);', [id, imageUrl.split('/photos')[1]])
    }
    return true
  }))
  console.log(result)
  console.log('Successfully Saved All Image File Paths')
}

export default saveFilePaths

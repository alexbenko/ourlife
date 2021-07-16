import fs from 'fs'
import { promisify } from 'util'

// promify used fs moduels since they dont return promises
export default {
  readdir: promisify(fs.readdir),
  readFile: promisify(fs.readFile),
  mkdir: promisify(fs.mkdir)
}

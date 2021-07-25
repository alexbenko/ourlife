import { compile } from 'tempura'
import { readFile } from 'fs/promises'
require('dotenv').config()

const render = async function (templatePath : string, params : {}) {
  const template = await readFile(templatePath, 'utf8')
  const render = compile(template)

  return (render(params))
}

export default render

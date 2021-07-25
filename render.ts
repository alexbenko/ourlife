import { compile } from 'tempura'
import { fsAsync } from './src/lib'
import { readFile } from 'fs/promises'
require('dotenv').config()

const foo = async () => {
  const template = await readFile('./templates/serverStart.hbs', 'utf8')
  const render = compile(template)
  const params = {
    startTime: new Date(),
    serverUrl: process.env.PRODUCTION_URL,
    endpoints: ['/status', '/error/today']
  }

  console.log(render(params))
}

foo()

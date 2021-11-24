import * as tls from 'tls'
import * as fs from 'fs'
import * as path from 'path'
import { notFound, success } from './response'

const sslConfigPath = path.join(__dirname, '../.ssl')
const contentFolder = path.join(__dirname, 'content')

const findFile = (uri: string) => {
  const filePath = path.join(contentFolder, uri)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      const indexPath = path.join(contentFolder, uri, 'index.gmi')
      if (fs.existsSync(indexPath)) {
        return indexPath
      }
    }
    return filePath
  } else {
    const gmiFilePath = path.join(contentFolder, uri + '.gmi')
    if (fs.existsSync(gmiFilePath)) {
      return gmiFilePath
    }
  }

  return null
}

tls
  .createServer(
    {
      key: fs.readFileSync(path.join(sslConfigPath, 'key.pem')),
      cert: fs.readFileSync(path.join(sslConfigPath, 'server.crt')),
    },
    (socket) => {
      socket.on('data', (data) => {
        const url: string = data.toString().trim()
        console.log('request:', url)
        let startOfPath = url.replace(/gemini:\/\/[^\\/]+/, '')
        if (startOfPath.endsWith('/')) {
          startOfPath = startOfPath.slice(0, startOfPath.length - 1)
        }
        const filePath = findFile(startOfPath)
        if (filePath === null) {
          notFound(socket, `Unknown file: ${startOfPath}`)
        } else {
          const content = fs.readFileSync(filePath).toString()
          success(socket, content)
        }
      })
    },
  )
  .listen(1965)

console.log('Gemini server available at gemini://localhost:1965')

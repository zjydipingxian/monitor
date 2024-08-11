import express from 'express'
import http from 'http'
import { port, FilePaths, ServerUrls } from './config'
import open from 'open'
const app = express()

const url = `http://localhost:${port}/JS/index.html`
console.log('🚀 ~ url:', url)

Object.entries(FilePaths).forEach(([path, resolvePath]) => {
  app.use(path, express.static(resolvePath))
})

// mock
app.get(ServerUrls.normalGet, (req, res) => {
  res.send('get 正常请求响应体')
})

app.get(ServerUrls.exceptionGet, (req, res) => {
  res.status(500).send('get 异常响应体!!!')
})

app.post(ServerUrls.normalPost, (req, res) => {
  res.send('post 正常请求响应体')
})

app.post(ServerUrls.exceptionPost, (req, res) => {
  res.status(500).send('post 异常响应体!!!')
})

app.post(ServerUrls.errorsUpload, (req, res) => {
  res.send('错误上报成功')
})

const server = http.createServer(app)

server.listen(port, () => {})
if (process.env.NODE_ENV === 'demo') {
  console.log('examples is available at: http://localhost:' + port)
  // open(url)
}
// console.log('1111')

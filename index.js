var express = require('express')
var app = express()
const path = require('path');

app.use(express.static('build'))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})

app.use('/login', (req, res) => {
  res.send(true)
})

app.listen(3000)

console.log('server started, listening on port 3000')

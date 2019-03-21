var express = require('express')
var app = express()
const path = require('path');

app.use(express.static('build'))
app.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})

app.use('/login', (req, res) => {
  res.send(true)
})

let port = process.env.PORT || 3000;
app.listen(port)

console.log('server started, listening on port ' + port)

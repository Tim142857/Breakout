var express = require('express')
var app = express()
const path = require('path');

app.use(express.static('build'))

app.get('/', (req, res) => {
  console.log('/')
  const index = path.join(__dirname, 'build', 'index.html');
  res.sendFile(index);
})

app.get('/play', (req, res) => {
  console.log('/play')
  const index = path.join(__dirname, 'build', 'index.html');
  res.sendFile(index);
})

let port = process.env.PORT || 3000;
app.listen(port)

console.log('server started, listening on port ' + port)

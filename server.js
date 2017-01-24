const http = require("http");
const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});

app.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('Hello World');
  response.end();
});

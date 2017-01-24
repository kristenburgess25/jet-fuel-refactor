const http = require("http");
const express = require('express');
const app = express();
const path = require('path');
let folders = {};

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});

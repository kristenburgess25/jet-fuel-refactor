const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.locals.folders = {};

app.locals.title = 'Jet Fuel Bookmarker';

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/bookmarks', (request, response) => {
  response.send(app.locals.folders );
});

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});

app.post('/bookmarks', (request, response) => {
  let requestFolder = request.body.folder;
  if (request.body.type === 'folder-update') {
    app.locals.folders[requestFolder] = [];
  } else {
    app.locals.folders[requestFolder].push(request.body);
  }
  // let folderOfNewBookmark = request.body.folder;
  // if (app.locals.folders[folderOfNewBookmark]) {
  //   app.locals.folders[folderOfNewBookmark].push(request.body);
  // } else {
  //   app.locals.folders[folderOfNewBookmark] = [];
  //   app.locals.folders[folderOfNewBookmark].push(request.body);
  // }
});

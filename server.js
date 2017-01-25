const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.locals.folders = {
  sports: {
    folderTitle: 'Sports',
    folderId: 1167,
    requestType: 'bookmark-update',
    urls: [
      {
        link: 'google.com',
        parentFolder: 'sports',
        bookmarkId: 1,
        requestType: 'bookmark-update',
      },
      {
        link: 'foo.bar',
        parentFolder: 'sports',
        bookmarkId: 23,
        requestType: 'bookmark-update',
      }
    ],
  }
};

app.locals.title = 'Jet Fuel Bookmarker';

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/bookmarks', (request, response) => {
  response.send(app.locals.folders);
});

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});

app.post('/bookmarks', (request, response) => {
  if (request.body.requestType === 'folder-update') {
    app.locals.folders[request.body.folderTitle] = {
      folderTitle: request.body.folderTitle,
      folderId: request.body.folderId,
      requestType: 'folder-update',
      urls: [],
    };
  } else {
    app.locals.folders[request.body.parentFolder].urls.push(request.body);
  }
});

app.get('/bookmarks/:folder', (request, response) => {
  const { folder } = request.params;
  const returnedFolder = app.locals.folders[folder];

  if (!app.locals.folders[folder]) {
    response.sendStatus(404);
  }

  response.json({
    returnedFolder,
  });
});

app.get('/bookmarks/:folder/:id', (request, response) => {
  const { folder } = request.params;
  const { id } = request.params;
  let bookmarks = app.locals.folders[folder].urls;
  let target;

  for (var i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].bookmarkId === parseInt(id, 10)) {
      target = bookmarks[i];
    }
  }

  if (!target) {
    response.sendStatus(404);
  }

  response.json({
    target,
  });

});

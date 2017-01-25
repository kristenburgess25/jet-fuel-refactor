// const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const shortenURL = require('./shorten-url');

app.locals.folders = {
  sports: {
    folderTitle: 'Sports',
    folderId: 1167,
    requestType: 'bookmark-update',
    urls: [
      {
        longURL: 'http://www.espn.com/',
        shortURL: shortenURL('http://www.espn.com/'),
        parentFolder: 'sports',
        bookmarkId: 1,
        dateAddedRaw: Date.now(),
        dateAddedHumanReadable: new Date(),
        clickCount: 0,
        requestType: 'bookmark-update',
      },
      {
        longURL: 'http://bleacherreport.com/',
        shortURL: shortenURL('http://bleacherreport.com/'),
        parentFolder: 'sports',
        bookmarkId: 23,
        dateAddedRaw: Date.now(),
        dateAddedHumanReadable: new Date(),
        clickCount: 0,
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
  let origLink = request.body.link;
  let validation = /http(s?)+/;
  if (request.body.requestType === 'folder-update') {
    if (!request.body.folderTitle) {
      throw new Error('You must specify a valid folder name.');
    }
    app.locals.folders[request.body.folderTitle] = {
      folderTitle: request.body.folderTitle,
      folderId: request.body.folderId,
      requestType: 'folder-update',
      urls: [],
    };
  } else {
    let alteredBookmark = {
      longURL: origLink,
      shortURL: shortenURL(origLink),
      parentFolder: request.body.parentFolder,
      bookmarkId: request.body.bookmarkId,
      dateAddedRaw: request.body.dateAddedRaw,
      dateAddedHumanReadable: request.body.dateAddedHumanReadable,
      clickCount: request.body.clickCount,
      requestType: request.body.requestType,
    }
    if (origLink.match(validation)) {
      if (!request.body.parentFolder) {
        throw new Error('You must specify a title for your bookmark.');
      }
      app.locals.folders[request.body.parentFolder].urls.push(alteredBookmark);
    } else {
      throw new Error('Invalid URL.')
    }
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

app.put('/bookmarks/:folder/:id', (request, response) => {
  const { folder } = request.params;
  const { id } = request.params;

  let bookmarks = app.locals.folders[folder].urls;
  let targetIndex;

  for (var i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].bookmarkId === parseInt(id, 10)) {
      targetIndex = bookmarks.indexOf(bookmarks[i]);
    }
  }

  if (!targetIndex) {
    response.sendStatus(404);
  }

  app.locals.folders[folder].urls[targetIndex].clickCount += 1;

  console.log(app.locals.folders[folder].urls[targetIndex]);

  // response.json({
  //     clickCount: app.locals.folders[folder].urls[targetIndex].clickCount,
  // });

});

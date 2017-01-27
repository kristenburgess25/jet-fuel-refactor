const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const shortenURL = require('./shorten-url');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Jet Fuel Bookmarker';

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/folders', (request, response) => {
  database('folders').select().then((data) => {
    response.status(200).json(data)
  }).catch(console.error('Problem with database.'));
});

app.get('/api/folders/:folderTitle', (request, response) => {
  const { folderTitle } = request.params;
  database('folders').where('folderTitle', folderTitle).select().then((folder) => {
    response.status(200).json(folder);
  }).catch((error) => {
    console.error('There was a problem with the API call.')
  });
});

app.get('/api/folders/:folderTitle/urls', (request, response) => {
  const { folderTitle } = request.params;
  database('urls').where('parentFolder',  folderTitle).select().then((urls) => {
    response.status(200).json(urls);
  }).catch((error) => {
    console.error('There was a problem with the API call.')
  });
});

app.post('/api/folders/:folderTitle/urls', (request, response) => {
  const { longURL, parentFolder, folder_id, clickCount, requestType } = request.body;

  const test = {
    longURL,
    shortURL: shortenURL(longURL),
    parentFolder,
    folder_id,
    clickCount,
    requestType,
  }

  database('urls').insert(test).then(() => { console.log('success')}).catch(console.log('failure'));

});


app.post('/api/folders', (request, response) => {
  const { folderTitle, requestType } =  request.body;

  const folder = {folderTitle, requestType}
  database('folders').insert(folder).then((folders) => {
    database('folders').select().then((folders) => {
      response.status(200).json(folders);
    }).catch((error) => {
      console.error('Problem with database.')
      response.status(500).send(`Error: ${error}`);
    })
  })
})

app.put('/api/folders/:folderId/urls/:urlid', (request, response) => {
  const { folderId, urlid } = request.params;

  database('urls').where('folder_id',  folderId).andWhere('id', id).insert({
    longURL: 'http://www.foo.com/',
    shortURL: shortenURL('http://www.foo.com/'),
    parentFolder: 'sports',
    folder_id: 1167,
    clickCount: 300,
    requestType: 'bookmark-update',
  }).then(() => {
    console.log('success');
  }).catch(console.log('failure'));
});

// app.put('/api/secrets', (request, response) => {
//   const { message, owner_id } = request.body
//   const id = md5(message)
//
//   const secret = { id, message, owner_id, created_at: new Date };
//   database('secrets').where({
//     id: owner_id,
//   }}).insert(secret)
//   .then(function() {
//     database('secrets').select()
//             .then(function(secrets) {
//               response.status(200).json(secrets);
//             })
//             .catch(function(error) {
//               console.error('somethings wrong with db')
//             });
//   })
// })

// app.get('/api/owners/:id', (request, response) => {
//   database('secrets').where('owner_id', request.params.id).select()
//           .then(function(secrets) {
//             response.status(200).json(secrets);
//           })
//           .catch(function(error) {
//             console.error('somethings wrong with redirect')
//           });
// })

app.get('/api/folders/urls', (request, response) => {
  database('urls').select().then((data) => {
    response.status(200).json(data)
  }).catch(console.error('Problem with database.'));
});

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});


// app.post('/bookmarks', (request, response) => {
//   let origLink = request.body.link;
//   let validation = /http(s?)+/;
//   if (request.body.requestType === 'folder-update') {
//     if (!request.body.folderTitle) {
//       throw new Error('You must specify a valid folder name.');
//     }
//     app.locals.folders[request.body.folderTitle] = {
//       folderTitle: request.body.folderTitle,
//       folderId: request.body.folderId,
//       requestType: 'folder-update',
//       urls: [],
//     };
//   } else {
//     let alteredBookmark = {
//       longURL: origLink,
//       shortURL: shortenURL(origLink),
//       parentFolder: request.body.parentFolder,
//       bookmarkId: request.body.bookmarkId,
//       dateAddedRaw: request.body.dateAddedRaw,
//       dateAddedHumanReadable: request.body.dateAddedHumanReadable,
//       clickCount: request.body.clickCount,
//       requestType: request.body.requestType,
//     }
//     if (origLink.match(validation)) {
//       if (!request.body.parentFolder) {
//         throw new Error('You must specify a title for your bookmark.');
//       }
//       app.locals.folders[request.body.parentFolder].urls.push(alteredBookmark);
//     } else {
//       throw new Error('Invalid URL.')
//     }
//   }
// });
//
// app.get('/bookmarks/:folder', (request, response) => {
//   const { folder } = request.params;
//   const returnedFolder = app.locals.folders[folder];
//
//   if (!app.locals.folders[folder]) {
//     response.sendStatus(404);
//   }
//
//   response.json({
//     returnedFolder,
//   });
// });
//
// app.get('/bookmarks/:folder/:id', (request, response) => {
//   const { folder } = request.params;
//   const { id } = request.params;
//   let bookmarks = app.locals.folders[folder].urls;
//   let target;
//
//   for (var i = 0; i < bookmarks.length; i++) {
//     if (bookmarks[i].bookmarkId === parseInt(id, 10)) {
//       target = bookmarks[i];
//     }
//   }
//
//   if (!target) {
//     response.sendStatus(404);
//   }
//
//   response.json({
//     target,
//   });
//
// });
//
// app.put('/bookmarks/:folder/:id', (request, response) => {
//   const { folder } = request.params;
//   const { id } = request.params;
//
//   let bookmarks = app.locals.folders[folder].urls;
//   let targetIndex;
//
//   for (var i = 0; i < bookmarks.length; i++) {
//     if (bookmarks[i].bookmarkId === parseInt(id, 10)) {
//       targetIndex = bookmarks.indexOf(bookmarks[i]);
//       target = bookmarks[i];
//     }
//   }
//
//   app.locals.folders[folder].urls[targetIndex].clickCount += 1;
//
//   console.log('The clicked on object whose click count should update', app.locals.folders[folder].urls[targetIndex]);
//
// });

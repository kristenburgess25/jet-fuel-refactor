const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.locals.folders = {
  sports: [
    {

    }
  ],
};

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
  // let requestFolder = request.body.name;
  if (request.body.type === 'folder-update') {
    app.locals.folders[request.body.id] = {
      name: request.body.name,
      id: request.body.id,
    };
  } else {
    app.locals.folders[requestFolder].push(request.body);
  }
});

app.get('/bookmarks/:folder', (request, response) => {
  const { folder } = request.params;

  response.json({
    folder,
  });
});

app.get('/bookmarks/:folder/:id', (request, response) => {
  const { folder } = request.params;
  const { id } = request.params;

  console.log(app.locals.folders[folder]);

  // const target = app.locals.folders[folder].filter((bookmark) => {
  //     return bookmark.id === id;
  //   })

  // response.json({
  //   target,
  // });
});

// app.get('/api/secrets/:id/', (request, response) => {
//   const { id } = request.params;
//   const message = app.locals.secrets[id];
//   if (!message) {
//     response.sendStatus(404);
//   }
//   response.json(
//     {
//       id,
//       message,
//     }
//   );
// });

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

  const url = {
    longURL,
    shortURL: shortenURL(longURL),
    parentFolder,
    folder_id,
    clickCount,
    created_at: new Date,
    rawDate: parseInt(Date.now().toString().slice(8, 13)),
    requestType,
  }

  database('urls').insert(url).then(() => { console.log('success')}).catch(console.log('failure'));

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

app.get('/api/folders/urls', (request, response) => {
  database('urls').select().then((data) => {
    response.status(200).json(data)
  }).catch(console.error('Problem with database.'));
});

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});

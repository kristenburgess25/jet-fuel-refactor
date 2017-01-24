const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
let folders = {};

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/bookmarks', (request, response) => {
  response.send(folders);
});

app.listen(app.get('port'), () => {
  console.log('The HTTP server is listening at Port 3000.');
});

app.post('/bookmarks', (request, response) => {
  let newFolder = request.body.folder;
  folders[newFolder] = [];
  folders[newFolder].push(request.body);
  // const { quizId } = request.params;
  // const question = request.body;
  //
  // for (let requiredParameter of ['title', 'answers']) {
  //   if (!question[requiredParameter]) {
  //     return response
  //       .status(422)
  //       .send({ error: `Expected format: { title: <String>, answers: <Array> }. You're missing a "${requiredParameter}" property.` });
  //   }
  // }
  //
  // question.id = question.id || Date.now();
  //
  // const quiz = app.locals.quizzes.find(q => q.id == quizId);
  // if (quiz) {
  //   quiz.questions.push(question);
  //   return response.send({ quiz });
  // } else {
  //   return response
  //     .status(404)
  //     .send({ error: `Quiz with an id of ${quizId} not found.` });
  //   }
});

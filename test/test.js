'use strict';
const assert = require('assert');
const request = require('supertest');
const express = require('express');
const app = require('../');

describe('GET /', () => {

  it('should return a 200 status code', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
  it('should return 404 for invalid path', (done) => {
   request(app)
     .get('/foo')
     .expect(404, done);
 });
});

describe('GET /api/folders', () => {

  it('should return a 200 status code', (done) => {
    request(app)
      .get('/api/folders')
      .expect(200, done);
  });
  it('should return 404 for invalid path', (done) => {
   request(app)
     .get('/foo/bar')
     .expect(404, done);
 });
  it.skip('should return a set bookmarks stored in app.locals', (done) => {
  request(app)
    .get('/bookmarks')
    .expect(200, app.locals.folders, done);
});
});

describe('GET /:folder', () => {

  it('should return a 200 status code when accessing a specific folder', (done) => {
  //figure out how to dynamically pass in folder
    request(app)
      .get('/folders/sports')
      .expect(200, done);
  });
  it('should return 404 for invalid path', (done) => {
    //write test for folder titles having to be strings?
   request(app)
     .get('/bookmarks/1234')
     .expect(404, done);
 });
  it.skip('should return a specified folder stored in app.locals.folders', (done) => {
  request(app)
    .get('/bookmarks/sports')
    .expect(200, app.locals.folders.sports, done);
});
});

describe('GET /:id', () => {

  it('should return a 200 status code', (done) => {
  //figure out how to dynamically pass in id
  //write tests for id type always being integer?
  //what -will- the id type be in final product?
    request(app)
      .get('/bookmarks/sports/1')
      .expect(200, done);
  });
  it('should return 404 for invalid path', (done) => {
   request(app)
     .get('/bookmarks/sports/abc')
     .expect(404, done);
 });
});

// describe('POST /bookmarks', () => {
//
//
//   it('should create a new bookmark folder', (done) => {
//     const newBookmark = {
//       folderTitle: 'Horses',
//       folderId: 25,
//       requestType: 'folder-update',
//       urls: [],
//     };
//     request(app)
//       .post('/bookmarks')
//       .send(newBookmark)
//       .expect(200)
//       .end(() => {
//         assert.equal(app.locals.folders.length, 3);
//         done();
//       });
//   });
// });

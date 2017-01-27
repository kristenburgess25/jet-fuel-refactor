'use strict';
const assert = require('assert');
const request = require('supertest');
const express = require('express');
const app = require('../');

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


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

describe('GET /api/folders/:folder', () => {

  it('should return a 200 status code when accessing a specific folder', (done) => {
  //figure out how to dynamically pass in folder
    request(app)
      .get('/api/folders/1167')
      .expect(200, done);
  });

  it('should return 400 for bad request', (done) => {
    //write test for folder titles having to be strings?
   request(app)
     .get('/api/folders/@%8')
     .expect(400, done);
 });
});

describe('GET /:id', () => {

  it('should return a 200 status code', (done) => {
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

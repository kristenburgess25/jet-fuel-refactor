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
});

describe('GET /bookmarks', () => {

  it('should return a 200 status code', (done) => {
    request(app)
      .get('/bookmarks')
      .expect(200, done);
  });
  it('should return a set bookmarks stored in app.locals.folders', (done) => {
  request(app)
    .get('/bookmarks')
    .expect(200, app.locals.folders, done);
});
});

describe('GET /:folder', () => {

  it('should return a 200 status code', (done) => {
  //figure out how to dynamically pass in folder
    request(app)
      .get('/bookmarks/sports')
      .expect(200, done);
  });
});

describe('GET /:id', () => {

  it('should return a 200 status code', (done) => {
  //figure out how to dynamically pass in id
    request(app)
      .get('/bookmarks/sports/1')
      .expect(200, done);
  });
});

// describe('POST /bookmarks', () => {
//
//   beforeEach(() => {
//     app.locals.folders.sports.urls.data = [
//       {
//         link: shortenURL('http://www.espn.com/'),
//         parentFolder: 'sports',
//         bookmarkId: 1,
//         requestType: 'bookmark-update',
//       },
//       {
//         link: shortenURL('http://bleacherreport.com/'),
//         parentFolder: 'sports',
//         bookmarkId: 23,
//         requestType: 'bookmark-update',
//       }
//     ];
//   });
//
//   it('should create a new bookmark', (done) => {
//     const newBookmark = {
//       link: shortenURL('http://bleacherreport.com/'),
//       parentFolder: 'sports',
//       bookmarkId: 25,
//       requestType: 'bookmark-update',
//     };
//     request(app)
//       .post('/bookmarks')
//       .send(newBookmark)
//       .expect(201)
//       .end(() => {
//         assert.equal(app.locals.folders.urls.data.length, 3);
//         done();
//       });
//   });
// });

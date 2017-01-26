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
  it('should return a set bookmarks stored in app.locals', (done) => {
  request(app)
    .get('/bookmarks')
    .expect(200, app.locals.folders, done);
});
});

describe('GET /:folder', () => {

  it.skip('should return a 200 status code', (done) => {
  //figure out how to dynamically pass in folder
    request(app)
      .get('/bookmarks/sports')
      .expect(200, done);
  });
  it('should return a specified folder stored in app.locals.folders', (done) => {
  request(app)
    .get('/bookmarks/sports')
    .expect(200, app.locals.folders.sports, done);
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

describe('POST /bookmarks', () => {


  it('should create a new bookmark folder', (done) => {
    const newBookmark = {
      folderTitle: 'Horses',
      folderId: 25,
      requestType: 'folder-update',
      urls: [],
    };
    request(app)
      .post('/bookmarks')
      .send(newBookmark)
      .expect(201)
      .end(() => {
        assert.equal(app.locals.folders.length, 3);
        done();
      });
  });
});

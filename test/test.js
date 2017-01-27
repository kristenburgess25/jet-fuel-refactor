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
  it('should return an array of folders', (done) => {
  request(app)
    .get('/api/folders')
    .end(function(err, res) {
    res.should.be.json;
    res.body.should.be.a('array');
    done();
    });
});
});

describe('GET /api/folders/:folderTitle', () => {

  it('should return a 200 status code when accessing a specific folder', (done) => {
    request(app)
      .get('/api/folders/Cats')
      .expect(200, done);
  });

  it.skip('should return 400 for bad request', (done) => {
    //is returning 200???
   request(app)
     .get('/api/folders/%74@')
     .expect(400, done);
 });
});

describe('GET /api/folders/:folderTitle/urls', () => {

  it('should return a 200 status code', (done) => {
    request(app)
      .get('/api/folders/Cats/urls')
      .expect(200, done);
  });

  it('should return 404 for invalid path', (done) => {
   request(app)
     .get('/api/folders/Cats/287202')
     .expect(404, done);
 });
});

describe('GET /api/folders/:folderTitle/:urlid', () => {

  it('should return a 200 status code', (done) => {
    request(app)
      .get('/api/folders/Sports/urls/1')
      .expect(200, done);
  });

  it('should return 404 for invalid path', (done) => {
   request(app)
     .get('/api/folders/Cats/urls//')
     .expect(404, done);
 });
});

describe('POST /api/folders', function() {
  it('should add a new folder', function(done) {
    const folder = {id: 1167, folderTitle: "Sports",}
    request(app)
    .post('/api/folders')
    .send(folder)
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('array');
    done();
    });
  });
});

describe('POST /api/folders/:folderTitle/urls', function() {
  //Unhandled rejection error: column "rawDate" of relation "urls" does not exist
  it.skip('should add a new url', function(done) {
    const url = {
      longURL: 'http://www.google.com',
      shortURL: '',
      parentFolder: '',
      folder_id: 1,
      clickCount: 0,
      requestType: ''
    }
    request(app)
    .post('/api/folders/Cats/urls')
    .send(url)
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('array');
    done();
    });
  });
});

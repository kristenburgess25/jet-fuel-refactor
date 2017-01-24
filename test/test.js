'use strict';

const assert = require('assert');
const request = require('supertest');
var express = require('express');
var app = express();

describe('GET /', () => {

  it('should return a 200 status code', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

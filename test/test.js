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

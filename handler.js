'use strict';

const app = require('./src/service');

const serverless = require('serverless-http');
const { start } = require('./src/data/index');

const handler = serverless(app);

module.exports.hello = async (event, context) => {
  const result = await handler(event, context);
  start();
  return result;
};

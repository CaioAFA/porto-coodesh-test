// Express
const express = require('express');
const app = express();

// Body-Parser - Parse Form Data Send To Server
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const { configureRoutes } = require('../router/routes')
configureRoutes(app)

module.exports = app;
